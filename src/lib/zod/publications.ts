// lib/zod/publications.ts

// Esquemas de validación Zod para el dominio de publicaciones
import { z } from 'zod';
import { PublicationType, PublicationStatus } from '../types/publication';

export const createPublicationSchema = z.object({
  idUsuario: z.number().int().positive('ID de usuario debe ser positivo'),
  titulo: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres')
    .trim(),
  descripcion: z.string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .trim(),
  remuneracion: z.number()
    .min(0, 'La remuneración no puede ser negativa')
    .max(99999999.99, 'Remuneración excede el límite máximo'),
  // CORRECCIÓN: Se quita errorMap y se deja el objeto con el mensaje
  tipo: z.nativeEnum(PublicationType, {
    message: 'Tipo de trabajo no válido'
  }),
  fechaCierre: z.date()
    .refine(date => date > new Date(), {
      message: 'La fecha de cierre debe ser posterior a la fecha actual'
    }),
  idUbicacion: z.number().int().positive('ID de ubicación debe ser positivo'),
  idCategoria: z.number().int().positive('ID de categoría debe ser positivo')
});

// ESQUEMA PARA ListPublication
export const listPublicationsSchema = z.object({
  page: z.number().int().min(1, 'La página debe ser mayor a 0').optional().default(1),
  limit: z.number().int().min(1, 'El límite debe ser mayor a 0').max(100, 'El límite no puede exceder 100').optional().default(10),
  filters: z.object({
    titulo: z.string().min(1, 'El título no puede estar vacío').optional(),
    // CORRECCIÓN: Se quita errorMap
    tipo: z.nativeEnum(PublicationType, {
      message: 'Tipo de trabajo no válido'
    }).optional(),
    // CORRECCIÓN: Se quita errorMap
    estado: z.nativeEnum(PublicationStatus, {
      message: 'Estado no válido'
    }).optional(),
    idCategoria: z.number().int().positive('ID de categoría debe ser positivo').optional(),
    idUbicacion: z.number().int().positive('ID de ubicación debe ser positivo').optional(),
    remuneracionMin: z.number().min(0, 'La remuneración mínima no puede ser negativa').optional(),
    remuneracionMax: z.number().min(0, 'La remuneración máxima no puede ser negativa').optional(),
    fechaDesde: z.date().optional(),
    fechaHasta: z.date().optional()
  }).optional()
  .refine(filters => {
    if (!filters) return true;
    if (filters.remuneracionMin && filters.remuneracionMax) {
      return filters.remuneracionMin <= filters.remuneracionMax;
    }
    return true;
  }, {
    message: 'La remuneración mínima no puede ser mayor que la máxima'
  })
  .refine(filters => {
    if (!filters) return true;
    if (filters.fechaDesde && filters.fechaHasta) {
      return filters.fechaDesde <= filters.fechaHasta;
    }
    return true;
  }, {
    message: 'La fecha desde no puede ser posterior a la fecha hasta'
  }),
  sort: z.object({
    // CORRECCIÓN: Se quita errorMap
    field: z.enum(['fechaPublicacion', 'remuneracion', 'titulo'], {
      message: 'Campo de ordenamiento no válido'
    }),
    // CORRECIÓN: Se quita errorMap
    order: z.enum(['asc', 'desc'], {
      message: 'Orden debe ser asc o desc'
    })
  }).optional().default({ field: 'fechaPublicacion', order: 'desc' })
});

export const deletePublicationSchema = z.object({
  idPublicacion: z.number().int().positive('ID de publicación inválido'),
  idUsuario: z.number().int().positive('ID de usuario inválido')
});