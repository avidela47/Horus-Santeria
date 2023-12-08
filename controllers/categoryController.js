import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// Create Category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "El nombre es requerido",
      });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "La categoria ya existe",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "Nueva categoria creada",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error en Categoria",
    });
  }
};

// Update Category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(201).send({
      success: true,
      message: "Categoria actualizada",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error al actualizar Categoria",
    });
  }
};

// Get All Category
export const getAllCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(201).send({
      success: true,
      message: "Categorias obtenidas",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error al obtener Categorias",
    });
  }
};

// Get Id Category
export const getIdCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(201).send({
      success: true,
      message: "Categoria obtenida",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error al obtener Categoria",
    });
  }
};

// Delete Category
export const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    res.status(201).send({
      success: true,
      message: "Categoria eliminada",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error al eliminar Categoria",
    });
  }
};
