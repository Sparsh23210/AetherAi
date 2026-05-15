import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import asyncHandler from 'express-async-handler';
import { supabase } from '../config/supabase';

// @desc    Get all tools
// @route   GET /api/tools
// @access  Public
export const getTools = asyncHandler(async (req: Request, res: Response) => {
  const { category, limit, trending, ids } = req.query;

  let data;

  if (ids) {
    const idList = (ids as string).split(',');
    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('*')
      .in('id', idList);
    
    if (error) throw error;
    data = tools;
  } else if (category) {
    const { data: catTools, error } = await supabase
      .from('tool_categories')
      .select(`
        ai_tools:tool_id (*),
        categories:category_id!inner (slug)
      `)
      .eq('categories.slug', category);
    
    if (error) throw error;
    data = catTools?.map((item: any) => item.ai_tools).filter(Boolean) || [];
  } else {
    let query = supabase.from('ai_tools').select('*');

    if (trending === 'true') {
      query = query.order('popularity_score', { ascending: false });
    }

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const { data: tools, error } = await query;
    if (error) throw error;
    data = tools;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  const transformedTools = data?.map((tool: any) => {
    if (tool.logo_url && !tool.logo_url.startsWith('http')) {
      return {
        ...tool,
        logo_url: `${supabaseUrl}/storage/v1/object/public/tools/${tool.logo_url}`
      };
    }
    return tool;
  }) || [];

  res.status(200).json({ tools: transformedTools });
});

// @desc    Get single tool by slug
// @route   GET /api/tools/:slug
// @access  Public
export const getToolBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const { data: tool, error: toolError } = await supabase
    .from('ai_tools')
    .select('*')
    .eq('slug', slug)
    .single();

  if (toolError) {
    if (toolError.code === 'PGRST116') {
      res.status(404);
      throw new Error('Tool not found');
    }
    throw toolError;
  }

  const { data: tags, error: tagsError } = await supabase
    .from('tool_tags')
    .select('tag')
    .eq('tool_id', tool.id);

  if (tagsError) throw tagsError;

  const { data: categories, error: catsError } = await supabase
    .from('tool_categories')
    .select(`
      categories (id, name, slug, icon)
    `)
    .eq('tool_id', tool.id);

  if (catsError) throw catsError;

  const fullTool = {
    ...tool,
    tags: tags?.map(t => t.tag) || [],
    categories: categories?.map((c: any) => c.categories) || []
  };

  res.status(200).json({ tool: fullTool });
});

// @desc    Delete a tool
// @route   DELETE /api/tools/:id
// @access  Private
export const deleteTool = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.uid;

  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Check ownership
  const { data: tool, error: fetchError } = await supabase
    .from('ai_tools')
    .select('founder_id')
    .eq('id', id)
    .single();

  if (fetchError || !tool) {
    res.status(404);
    throw new Error('Tool not found');
  }

  if (tool.founder_id !== userId && req.user?.admin !== true) {
    res.status(403);
    throw new Error('Not authorized to delete this tool');
  }

  const { error } = await supabase
    .from('ai_tools')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.status(200).json({ success: true, message: 'Tool deleted successfully.' });
});

// @desc    Update a tool
// @route   PUT /api/tools/:id
// @access  Private
export const updateTool = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.uid;
  
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // 1. Verify Ownership
  const { data: tool, error: fetchError } = await supabase
    .from('ai_tools')
    .select('founder_id, category_name')
    .eq('id', id)
    .single();

  if (fetchError || !tool) {
    res.status(404);
    throw new Error('Tool not found');
  }

  if (tool.founder_id !== userId && req.user?.admin !== true) {
    res.status(403);
    throw new Error('Not authorized to edit this tool');
  }

  // 2. Prepare Update Data
  const {
    name, description, short_description, website_url, logo_url,
    pricing_type, speed_score, quality_score, founder_name,
    co_founder_name, category_name, contact_number, founder_email
  } = req.body;

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (short_description !== undefined) updateData.short_description = short_description;
  if (website_url !== undefined) updateData.website_url = website_url;
  if (logo_url !== undefined) updateData.logo_url = logo_url;
  if (pricing_type !== undefined) updateData.pricing_type = pricing_type;
  if (speed_score !== undefined) updateData.speed_score = speed_score;
  if (quality_score !== undefined) updateData.quality_score = quality_score;
  if (founder_name !== undefined) updateData.founder_name = founder_name;
  if (co_founder_name !== undefined) updateData.co_founder_name = co_founder_name;
  if (category_name !== undefined) updateData.category_name = category_name;
  if (contact_number !== undefined) updateData.contact_number = contact_number;
  if (founder_email !== undefined) updateData.founder_email = founder_email;

  // Re-generate slug if name changes
  if (name) {
    updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // 3. Update main table
  const { data: updatedTool, error: updateError } = await supabase
    .from('ai_tools')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (updateError) throw updateError;

  // 4. Update Category Link if category changed
  if (category_name && category_name !== tool.category_name) {
    // Get the new category ID
    const { data: newCat } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category_name)
      .single();

    if (newCat) {
      // Find and delete old category link
      await supabase
        .from('tool_categories')
        .delete()
        .eq('tool_id', id);

      // Insert new category link
      await supabase
        .from('tool_categories')
        .insert([{ tool_id: id, category_id: newCat.id }]);
    }
  }

  res.status(200).json({ success: true, tool: updatedTool });
});
