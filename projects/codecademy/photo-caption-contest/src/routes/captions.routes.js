const express = require('express');
const { sequelize, Caption, Photo, User } = require('../models');
const cache = require('../services/cache');
const auth = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');
const asyncHandler = require('../middleware/async-handler');

const router = express.Router();

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid caption id' });
  }

  const caption = await cache.getOrSet(`caption:${id}`, () =>
    Caption.findByPk(id, {
      include: [
        {
          model: Photo,
          as: 'photo',
          attributes: ['id', 'title', 'image_path']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    })
  );

  if (!caption) {
    return res.status(404).json({ message: 'Caption not found' });
  }

  return res.json(caption);
}));

router.post('/', auth, requireFields(['photo_id', 'comment']), asyncHandler(async (req, res) => {
  const photoId = Number(req.body.photo_id);
  if (!Number.isInteger(photoId)) {
    return res.status(400).json({ message: 'Invalid photo_id' });
  }

  const transaction = await sequelize.transaction();

  try {
    const photo = await Photo.findByPk(photoId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!photo) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Photo not found' });
    }

    const caption = await Caption.create(
      {
        comment: req.body.comment,
        photo_id: photoId,
        user_id: req.user.id
      },
      { transaction }
    );

    photo.caption_count += 1;
    await photo.save({ transaction });

    await transaction.commit();

    cache.del('photos:list');
    cache.del(`photos:${photoId}`);

    return res.status(201).json(caption);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}));

router.put('/:id', auth, requireFields(['comment']), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid caption id' });
  }

  const caption = await Caption.findByPk(id);
  if (!caption) {
    return res.status(404).json({ message: 'Caption not found' });
  }

  if (caption.user_id !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to edit this caption' });
  }

  caption.comment = req.body.comment;
  await caption.save();

  cache.del(`caption:${id}`);
  cache.del(`photos:${caption.photo_id}`);
  return res.json(caption);
}));

router.delete('/:id', auth, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid caption id' });
  }

  const transaction = await sequelize.transaction();

  try {
    const caption = await Caption.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!caption) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Caption not found' });
    }

    if (caption.user_id !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({ message: 'Not authorized to delete this caption' });
    }

    const photo = await Photo.findByPk(caption.photo_id, { transaction, lock: transaction.LOCK.UPDATE });

    await caption.destroy({ transaction });

    if (photo && photo.caption_count > 0) {
      photo.caption_count -= 1;
      await photo.save({ transaction });
    }

    await transaction.commit();

    cache.del('photos:list');
    cache.del(`photos:${caption.photo_id}`);
    cache.del(`caption:${id}`);

    return res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}));

module.exports = router;
