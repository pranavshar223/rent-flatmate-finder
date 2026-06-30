exports.healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    service: 'rent-flatmate-finder-backend',
  });
};
