import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { supabase } from '../config/supabase';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  res.status(200).json({ categories: data });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug } = req.body;
  if (!name || !slug) {
    res.status(400);
    throw new Error('Name and slug required');
  }

  const { data, error } = await supabase
    .from('categories')
    .upsert({ name, slug }, { onConflict: 'slug' })
    .select()
    .single();

  if (error) throw error;
  res.status(201).json({ success: true, category: data });
});

// @desc    Link tool to category
// @route   POST /api/tools/:id/categories
// @access  Private/Admin
export const linkToolToCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { categoryId } = req.body;
  
  if (!id || !categoryId) {
    res.status(400);
    throw new Error('Tool ID and Category ID required');
  }

  const { error } = await supabase
    .from('tool_categories')
    .insert([{ tool_id: id, category_id: categoryId }]);

  if (error) throw error;
  res.status(200).json({ success: true });
});
