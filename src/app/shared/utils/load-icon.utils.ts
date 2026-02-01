import { addIcons } from "ionicons"
import {
  closeCircleOutline,
  informationCircle,
  image,
  checkmarkCircle,
  cloudUpload,
  power,
  camera,
  trash,
  alertCircle,
  star,
  addCircle,
  list,
  trashOutline,
  closeOutline,
  addOutline,
  checkmarkDone,
  optionsOutline,
  pricetag,
  createOutline,
  warning
} from "ionicons/icons"

export const loadIcon = () => {
  addIcons({
      "close-circle-outline": closeCircleOutline,
  "information-circle": informationCircle,
  "image": image,
  "checkmark-circle": checkmarkCircle,
  "cloud-upload": cloudUpload,
  "power": power,
  "camera": camera,
  "trash": trash,
  "alert-circle": alertCircle,
  "star": star,
  "add-circle": addCircle,
  "list": list,
  "trash-outline": trashOutline,
  "close-outline": closeOutline,
  "add-outline": addOutline,
  "checkmark-done": checkmarkDone,
  "create-outline": createOutline,
  "options-outline": optionsOutline,
  "pricetag": pricetag,
  "warning": warning,
  })
}
