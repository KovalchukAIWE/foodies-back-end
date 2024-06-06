const normalizeFields = (req, res, next) => {
  const { category, area } = req.query;

  if (category) {
    req.query.category = capitalize(category);
  }

  if (area) {
    req.query.area = capitalize(area);
  }

  next();
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default normalizeFields;
