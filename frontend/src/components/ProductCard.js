import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import './ProductCard.css';

/**
 * ProductCard component for displaying individual product details in a card format.
 * Allows navigation to the product details page on click.
 * 
 * @component
 * @param {Object} props The component props.
 * @param {Object} props.product The product object containing details.
 * @param {number} props.product.id The unique identifier for the product.
 * @param {string} props.product.name The name of the product.
 * @param {string} props.product.image_url The URL of the product image.
 * @param {string} props.product.link_url The URL of the product details page.
 * @param {number} props.product.price The price of the product.
 * @param {array}  props.product.tags The tags associated with the product.
 * @example
 * const product = {
 *   "id": "100-100000910WOF",
 *   "name": "AMD - Ryzen 7 7800X3D",
 *   "price": "$449.00",
 *   "image_url": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6537/6537139_sd.jpg;maxHeight=192;maxWidth=300",
 *   "link_url": "https://www.bestbuy.com/site/amd-ryzen-7-7800x3d-8-core-16-thread-4-2-ghz-5-0-ghz-max-boost-socket-am5-unlocked-desktop-processor-black/6537139.p?skuId=6537139",
 *   "tags": [
 *     "Advanced Multitasking",
 *     "High Clock Speed",
 *     "Gaming and Creation"
 *   ]
 *  };
 * return (
 *   <ProductCard product={product} />
 * )
 */
function ProductCard({ product }) {
  return (
    <a href={product.link_url} className="product-item-link" target="_blank" rel="noopener noreferrer">
      <Card className="product-item">
        <div className="product-item-image-container">
          <Card.Img variant="top" src={product.image_url} alt={product.name} className="product-item-image" />
        </div>
        <Card.Body className="product-item-details">
          <Card.Title className="product-item-name">{product.name}</Card.Title>
          <Card.Text className="product-item-price">${product.price.toFixed(2)}</Card.Text>
          <div className="product-item-tags">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="product-item-tag">
                {tag}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    </a>
  );
}

export default ProductCard;
