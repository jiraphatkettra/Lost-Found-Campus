import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { EditItemClient } from "./EditItemClient";

interface EditItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/items/${id}/edit`);
  }

  const item = await prisma.item.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  // ป้องกันสิทธิ์: เฉพาะเจ้าของประกาศเท่านั้นที่แก้ไขได้
  if (item.ownerId !== session?.user?.id) {
    redirect(`/items/${id}`);
  }

  return <EditItemClient item={item} />;
}
