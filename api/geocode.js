import axios from 'axios';

export default async (req, res) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error);
  }
};
