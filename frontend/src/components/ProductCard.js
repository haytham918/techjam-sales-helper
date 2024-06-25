import React from 'react';
import { Card, Button } from 'react-bootstrap';
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
 * @param {string} props.product.imageUrl The URL of the product image.
 * @param {number} props.product.price The price of the product.
 * @param {number} props.product.salesVolume The sales volume of the product.
 * @example
 * const product = { id: 1, name: 'Apple', imageUrl: 'apple.jpg', price: 1.99, salesVolume: 5000 };
 * return (
 *   <ProductCard product={product} />
 * )
 */
function ProductCard({ product }) {
  return (
    <Card className="product-item">
      <div className="product-item-image-container">
        <Card.Img variant="top" src={product.imageUrl} alt={product.name} className="product-item-image" />
        <Button variant="outline-light" className="product-item-add-to-cart-button">
          <span className="button-icon">+</span>
        </Button>
      </div>
      <Card.Body className="product-item-details">
        <Card.Title className="product-item-name">{product.name}</Card.Title>
        <Card.Text className="product-item-price">${product.price.toFixed(2)}</Card.Text>
        <Card.Text className="product-item-volume">{product.salesVolume}+ sold</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
