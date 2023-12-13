import * as yup from 'yup'

export const nameval = yup.string().min(3).required("This Field Requiered")
export const orgTypeval = yup.string().min(2).max(30).required("This Field Requiered")
export const newOrgTypeval = yup.string().min(1).required("This Field Requiered")
export const editordesc = yup.string().min(3)
export const email = yup.string().email().required()
export const numberval = yup.string().required()
export const fieldwithspecl = yup.string().min(3).required()
export const phone = yup
  .string()
  .matches(/^[0-9]+$/, '')
  .length(12, '')
  .required()
export const noreq = yup.string()
