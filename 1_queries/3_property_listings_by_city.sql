SELECT properties.id, title, cost_per_night, avg(property_reviews.rating) as average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
WHERE city like '%ancouv%' 
GROUP BY properties.id
having avg(property_reviews.rating) >= 4
ORDER BY cost_per_night ASC
LIMIT 10;