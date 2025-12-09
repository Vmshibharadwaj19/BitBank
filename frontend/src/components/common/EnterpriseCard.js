import React from 'react';
import './EnterpriseCard.css';

const EnterpriseCard = ({ 
  children, 
  title, 
  subtitle, 
  icon, 
  gradient,
  className = '',
  onClick,
  hover = true 
}) => {
  return (
    <div 
      className={`enterprise-card ${gradient ? `gradient-${gradient}` : ''} ${hover ? 'hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {(title || icon) && (
        <div className="enterprise-card-header">
          {icon && <div className="enterprise-card-icon">{icon}</div>}
          <div>
            {title && <h3 className="enterprise-card-title">{title}</h3>}
            {subtitle && <p className="enterprise-card-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="enterprise-card-content">
        {children}
      </div>
    </div>
  );
};

export default EnterpriseCard;


