import { z } from 'zod';

export const allergies = ['peanuts', 'dairy', 'gluten', 'soy', 'shellfish'] as const;

const geometrySchema = z.object({
	type: z.literal('Feature'),
	properties: z.object({}),
	geometry: z.object({
		coordinates: z.number().array().array().array(),
		type: z.literal('Polygon')
	})
});

export const newAoiDataNameSchema = z.string().max(20);
export const newAoiDataDescriptionSchema = z.string().max(512).optional();
export const newAoiDataGeometrySchema = geometrySchema;
