import api from "../utils/api";

export async function getScooters() {
  const res = await api.get("/scooters");
  return res.data;
}

export async function getScooter(id) {
  const res = await api.get(`/scooters/${id}`);
  return res.data;
}

export async function createScooter(scooterData) {
  const formData = new FormData();
  
  // Append all fields except images
  Object.keys(scooterData).forEach(key => {
    if (key !== "images") {
      if (Array.isArray(scooterData[key])) {
        scooterData[key].forEach(item => {
          formData.append(`${key}[]`, item);
        });
      } else if (typeof scooterData[key] === "object") {
        Object.keys(scooterData[key]).forEach(subKey => {
          formData.append(`${key}[${subKey}]`, scooterData[key][subKey]);
        });
      } else {
        formData.append(key, scooterData[key]);
      }
    }
  });

  // Append images
  if (scooterData.images) {
    scooterData.images.forEach(file => {
      formData.append("images", file);
    });
  }

  const res = await api.post("/scooters", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
}

export async function updateScooter(id, scooterData) {
  const formData = new FormData();
  
  // Append all fields except images
  Object.keys(scooterData).forEach(key => {
    if (key !== "images") {
      if (Array.isArray(scooterData[key])) {
        scooterData[key].forEach(item => {
          formData.append(`${key}[]`, item);
        });
      } else if (typeof scooterData[key] === "object") {
        Object.keys(scooterData[key]).forEach(subKey => {
          formData.append(`${key}[${subKey}]`, scooterData[key][subKey]);
        });
      } else {
        formData.append(key, scooterData[key]);
      }
    }
  });

  // Append images
  if (scooterData.images) {
    scooterData.images.forEach(file => {
      formData.append("images", file);
    });
  }

  const res = await api.put(`/scooters/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
}

export async function deleteScooter(id) {
  const res = await api.delete(`/scooters/${id}`);
  return res.data;
}
