const express = require('express');
const { Photo, Caption, User } = require('../models');
const cache = require('../services/cache');
const { requireFields } = require('../middleware/validate');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/async-handler');

const router = express.Router();

function photoWithPublicPath(photo, req) {
  const value = photo.toJSON();
  value.image_url = `${req.protocol}://${req.get('host')}${value.image_path}`;
  return value;
}

router.get('/', asyncHandler(async (req, res) => {
  const photos = await cache.getOrSet('photos:list', () =>
    Photo.findAll({
      order: [['id', 'ASC']],
      attributes: ['id', 'title', 'image_path', 'source', 'caption_count', 'created_at']
    })
  );

  return res.json(photos.map((photo) => photoWithPublicPath(photo, req)));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid photo id' });
  }

  const photo = await cache.getOrSet(`photos:${id}`, () =>
    Photo.findByPk(id, {
      attributes: ['id', 'title', 'image_path', 'source', 'caption_count', 'created_at'],
      include: [
        {
          model: Caption,
          as: 'captions',
          attributes: ['id', 'comment', 'created_at'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name']
          }]
        }
      ]
    })
  );

  if (!photo) {
    return res.status(404).json({ message: 'Photo not found' });
  }

  return res.json(photoWithPublicPath(photo, req));
}));

router.post('/', auth, requireFields(['title', 'image_path']), asyncHandler(async (req, res) => {
  const { title, image_path, source } = req.body;
  const photo = await Photo.create({ title, image_path, source: source || null });

  cache.del('photos:list');
  return res.status(201).json(photoWithPublicPath(photo, req));
}));

module.exports = router;
