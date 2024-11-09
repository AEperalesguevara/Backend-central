import prisma from '../config/db';

export const getAllFoods = async () => {
    return await prisma.food.findMany();
};

export const createFood = async (data: any) => {
    return await prisma.food.create({ data });
};

export const deleteFood = async (id: number) => { 
    return await prisma.food.delete({ where: { id } });
};
