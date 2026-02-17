import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@empresa.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@empresa.com",
      password: hashedPassword,
      role: Role.ADMIN,
      department: "Diretoria",
    },
  });

  console.log("✔ Admin criado: " + admin.email);
  console.log("  Senha padrão: admin123");
  console.log("  ⚠ Troque a senha no primeiro acesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
