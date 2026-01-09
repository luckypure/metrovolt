// Demo data: Chai Sutta Bar and MetroVolt placeholders (since we don't have real showrooms yet)
const showrooms = [
  {
    id: "csb-nyc",
    name: "Chai Sutta Bar - Times Square",
    address: "123 Broadway",
    city: "New York",
    state: "NY",
    zipCode: "10036",
    phone: "+1 (555) 123-0001",
    email: "timesquare@chaisuttabar.com",
    latitude: 40.7580,
    longitude: -73.9855,
    hours: "Mon-Sun: 8AM-11PM",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chai+Sutta+Bar+Times+Square",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  },
  {
    id: "csb-queens",
    name: "Chai Sutta Bar - Queens",
    address: "45-02 Queens Blvd",
    city: "Queens",
    state: "NY",
    zipCode: "11104",
    phone: "+1 (555) 123-0002",
    email: "queens@chaisuttabar.com",
    latitude: 40.7430,
    longitude: -73.9196,
    hours: "Mon-Sun: 8AM-11PM",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chai+Sutta+Bar+Queens",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  },
  {
    id: "csb-brooklyn",
    name: "Chai Sutta Bar - Brooklyn",
    address: "789 Flatbush Ave",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11226",
    phone: "+1 (555) 123-0003",
    email: "brooklyn@chaisuttabar.com",
    latitude: 40.6500,
    longitude: -73.9496,
    hours: "Mon-Sun: 8AM-11PM",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chai+Sutta+Bar+Brooklyn",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  },
  {
    id: "csb-la",
    name: "Chai Sutta Bar - Downtown LA",
    address: "456 Sunset Blvd",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90012",
    phone: "+1 (555) 123-0004",
    email: "la@chaisuttabar.com",
    latitude: 34.0522,
    longitude: -118.2437,
    hours: "Mon-Sun: 8AM-11PM",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chai+Sutta+Bar+Los+Angeles",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  },
  {
    id: "csb-chicago",
    name: "Chai Sutta Bar - Chicago Loop",
    address: "890 Michigan Ave",
    city: "Chicago",
    state: "IL",
    zipCode: "60605",
    phone: "+1 (555) 123-0005",
    email: "chicago@chaisuttabar.com",
    latitude: 41.8781,
    longitude: -87.6298,
    hours: "Mon-Sun: 8AM-11PM",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chai+Sutta+Bar+Chicago",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  },
  {
    id: "csb-miami",
    name: "Chai Sutta Bar - Miami Beach",
    address: "234 Ocean Dr",
    city: "Miami",
    state: "FL",
    zipCode: "33139",
    phone: "+1 (555) 123-0006",
    email: "miami@chaisuttabar.com",
    latitude: 25.7617,
    longitude: -80.1918,
    hours: "Mon-Sun: 8AM-11PM",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chai+Sutta+Bar+Miami",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  },
  {
    id: "csb-sf",
    name: "Chai Sutta Bar - San Francisco",
    address: "456 Market St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    phone: "+1 (555) 123-0007",
    email: "sf@chaisuttabar.com",
    latitude: 37.7749,
    longitude: -122.4194,
    hours: "Mon-Sun: 8AM-11PM",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chai+Sutta+Bar+San+Francisco",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  },
  {
    id: "csb-delhi",
    name: "Chai Sutta Bar - Connaught Place",
    address: "11B Connaught Place",
    city: "Delhi",
    state: "DL",
    zipCode: "110001",
    phone: "+91 99999 00001",
    email: "cp@chaisuttabar.com",
    latitude: 28.6271,
    longitude: 77.2166,
    hours: "Mon-Sun: 8AM-11PM",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chai+Sutta+Bar+Connaught+Place",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  },
  {
    id: "csb-mumbai",
    name: "Chai Sutta Bar - Bandra",
    address: "24 Linking Road",
    city: "Mumbai",
    state: "MH",
    zipCode: "400050",
    phone: "+91 99999 00002",
    email: "bandra@chaisuttabar.com",
    latitude: 19.0760,
    longitude: 72.8777,
    hours: "Mon-Sun: 8AM-11PM",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chai+Sutta+Bar+Bandra",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"
  }
];

// GET ALL SHOWROOMS (PUBLIC)
exports.getShowrooms = async (req, res) => {
  try {
    res.json(showrooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET NEAREST SHOWROOMS (PUBLIC)
// In a real app, this would calculate distance based on user location
exports.getNearestShowrooms = async (req, res) => {
  try {
    const { city, latitude, longitude } = req.query;

    let nearest = [...showrooms];

    // If city provided, prioritize showrooms in that city
    if (city) {
      const cityShowrooms = showrooms.filter(s => 
        s.city.toLowerCase().includes(city.toLowerCase())
      );
      if (cityShowrooms.length > 0) {
        nearest = cityShowrooms;
      }
    }

    // If coordinates provided, sort by distance (simplified)
    if (latitude && longitude) {
      nearest = nearest.map(showroom => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          showroom.latitude,
          showroom.longitude
        );
        return { ...showroom, distance };
      }).sort((a, b) => a.distance - b.distance);
    }

    res.json(nearest.slice(0, 3)); // Return top 3 nearest
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper function to calculate distance (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
