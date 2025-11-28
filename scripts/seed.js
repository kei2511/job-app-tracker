const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main(){
  const db = new PrismaClient();
  try{
    const admin = await db.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: { username: 'admin', password: await bcrypt.hash('password123', 10) }
    });

    const user = await db.user.upsert({
      where: { username: 'user' },
      update: {},
      create: { username: 'user', password: await bcrypt.hash('userpass', 10) }
    });

    console.log('Seeded:', { admin: admin.username, user: user.username });
  }catch(e){
    console.error('Seed error', e);
    process.exitCode = 1;
  }finally{
    await db.$disconnect();
  }
}

main();
