export const enforceTenant = (req, res, next) => {
  const tenantId =
    req.params.organizationId ||
    req.body.organization ||
    req.query.organization;

  if (tenantId && tenantId.toString() !== req.user.organization.toString()) {
    return res.status(403).json({
      success: false,
      message: "Tenant access violation"
    });
  }

  next();
};
