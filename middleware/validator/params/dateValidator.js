function validatorDate(req, res, next) {
  const date = req.query.date;
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!date) {
    next();
  } else if (dateFormatRegex.test(date)) {
    const formatedDate = new Date(date);
    if (!isNaN(formatedDate)) {
      next();
    } else {
      res.status(400).send({ error: "Invalid Date param value" });
    }
  } else {
    res.status(400).send({ error: "Invalid Date param format" });
  }
}

export { validatorDate };
