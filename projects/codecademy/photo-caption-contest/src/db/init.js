const { sequelize, Photo } = require('../models');

const defaultPhotos = [
  {
    title: 'Monkeys',
    image_path: '/images/monkeys.jpg',
    source: 'Comedy Wildlife Photography Awards'
  },
  {
    title: 'Puffin',
    image_path: '/images/puffin.jpg',
    source: 'Comedy Wildlife Photography Awards'
  },
  {
    title: 'Cubs',
    image_path: '/images/cubs.jpg',
    source: 'Comedy Wildlife Photography Awards'
  },
  {
    title: 'Parrots',
    image_path: '/images/parrots.jpg',
    source: 'Comedy Wildlife Photography Awards'
  }
];

async function init() {
  await sequelize.authenticate();
  await sequelize.sync();

  const existingCount = await Photo.count();
  if (existingCount === 0) {
    await Photo.bulkCreate(defaultPhotos);
  }

  console.log('Database initialized successfully.');
  await sequelize.close();
}

init().catch(async (error) => {
  console.error('Failed to initialize database:', error);
  await sequelize.close();
  process.exit(1);
});
