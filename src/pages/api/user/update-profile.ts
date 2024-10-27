import { PrismaClient } from '@prisma/client';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = session.user.id;
    const { photo, ...otherFields } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        photo,
        ...otherFields,
      },
    });

    res
      .status(200)
      .json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  } finally {
    await prisma.$disconnect();
  }
}
