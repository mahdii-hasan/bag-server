import Promotion from "./promotion.model.js";

export const getPromotionsService = async (query) => {
  const { type, place } = query;

  const filter = {};

  // Filter by type (hero, slider, etc.)
  if (type) {
    filter["display.type"] = type;
  }

  // Filter by place (homepage_top, etc.)
  if (place) {
    filter["display.place"] = place;
  }

  const [promotions, total] = await Promise.all([
    Promotion.find(filter)
      .populate("productId", "title slug price")
      .sort({ priority: 1}),

    Promotion.countDocuments(filter),
  ]);

  return {
    meta: {
      total, // ✅ total count
    },
    data: promotions,
  };
};

// Create Promotion
export const createPromotionService = async (payload) => {
  return await Promotion.create(payload);
};

// Update Promotion
export const updatePromotionService = async (id, payload) => {
  return await Promotion.findByIdAndUpdate(id, payload, { new: true });
};

// Delete Promotion
export const deletePromotionService = async (id) => {
  return await Promotion.findByIdAndDelete(id);
};
