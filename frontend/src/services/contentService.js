import api from "../utils/api";

export const getContent = async (section) => {
  const res = await api.get(`/content/${section}`);
  return res.data;
};

export const getAllContent = async () => {
  const res = await api.get("/content");
  return res.data;
};

export const updateContent = async (section, contentData) => {
  const formData = new FormData();
  
  // Append text fields
  Object.keys(contentData).forEach(key => {
    if (key !== "heroImage" && key !== "engineeringImage" && 
        key !== "supportImage" && key !== "technologyImage" && key !== "carouselImages") {
      if (Array.isArray(contentData[key])) {
        contentData[key].forEach((item, index) => {
          if (typeof item === "object") {
            Object.keys(item).forEach(subKey => {
              formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
            });
          } else {
            formData.append(`${key}[]`, item);
          }
        });
      } else {
        formData.append(key, contentData[key]);
      }
    }
  });

  // Append files
  if (contentData.heroImage) {
    formData.append("heroImage", contentData.heroImage);
  }
  if (contentData.engineeringImage) {
    formData.append("engineeringImage", contentData.engineeringImage);
  }
  if (contentData.supportImage) {
    formData.append("supportImage", contentData.supportImage);
  }
  if (contentData.technologyImage) {
    formData.append("technologyImage", contentData.technologyImage);
  }
  if (contentData.carouselImages) {
    contentData.carouselImages.forEach(file => {
      formData.append("carouselImages", file);
    });
  }

  const res = await api.put(`/content/${section}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};
