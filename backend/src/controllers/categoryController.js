const fs = require('fs');
const path = require('path');

const categoriesFilePath = path.join(__dirname, '../data/categories.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

const readCategories = () => {
  try {
    if (!fs.existsSync(categoriesFilePath)) {
      return [];
    }
    const data = fs.readFileSync(categoriesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
};

const saveCategories = (categories) => {
  fs.writeFileSync(categoriesFilePath, JSON.stringify(categories, null, 2));
};

const readProducts = () => {
  try {
    if (!fs.existsSync(productsFilePath)) return [];
    return JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
  } catch (e) {
    return [];
  }
};

// GET all categories
exports.getAllCategories = (req, res) => {
  try {
    const categories = readCategories();
    const products = readProducts();

    // Recalculate dynamic item counts based on live products
    const enriched = categories.map(cat => {
      const count = products.filter(p => 
        p.category && (
          p.category.toLowerCase() === cat.name.toLowerCase() ||
          p.category.toLowerCase() === cat.slug.toLowerCase()
        )
      ).length;
      return {
        ...cat,
        itemCount: count > 0 ? count : (cat.itemCount || 0)
      };
    });

    // Provide both full objects and string array for backwards compatibility
    const categoryNames = ['All', ...enriched.map(c => c.name)];
    const genders = ['All', 'Men', 'Women', 'Unisex'];

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
      categories: categoryNames,
      genders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

// CREATE category
exports.createCategory = (req, res) => {
  try {
    const { name, slug, description, department, icon, active } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const categories = readCategories();
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check duplicate slug
    if (categories.some(c => c.slug === generatedSlug)) {
      return res.status(400).json({ success: false, message: 'A category with this name/slug already exists' });
    }

    const newCategory = {
      id: `cat_${Date.now()}`,
      name: name.trim(),
      slug: generatedSlug,
      description: description || `Curated boutique garments for ${name.trim()}.`,
      department: department || 'Apparel',
      icon: icon || 'Shirt',
      itemCount: 0,
      active: active !== undefined ? Boolean(active) : true,
      createdAt: new Date().toISOString()
    };

    categories.push(newCategory);
    saveCategories(categories);

    res.status(201).json({
      success: true,
      message: 'Category created and stored in wardrobe taxonomy',
      data: newCategory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
  }
};

// UPDATE category
exports.updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, department, icon, active, itemCount } = req.body;

    const categories = readCategories();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const current = categories[index];
    const updatedCategory = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      slug: slug !== undefined ? slug.trim() : current.slug,
      description: description !== undefined ? description : current.description,
      department: department !== undefined ? department : current.department,
      icon: icon !== undefined ? icon : current.icon,
      active: active !== undefined ? Boolean(active) : current.active,
      itemCount: itemCount !== undefined ? Number(itemCount) : current.itemCount,
      updatedAt: new Date().toISOString()
    };

    categories[index] = updatedCategory;
    saveCategories(categories);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category', error: error.message });
  }
};

// DELETE category
exports.deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    const categories = readCategories();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const deleted = categories.splice(index, 1)[0];
    saveCategories(categories);

    res.json({
      success: true,
      message: `Category '${deleted.name}' removed from wardrobe taxonomy`,
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
  }
};
