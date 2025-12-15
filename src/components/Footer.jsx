import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        
        {}
        <div className="footer-section footer-left">
          <div className="footer-logo">
            <Link to="/">
                {}
                <img 
                    src="/images/skull.png" 
                    alt="Vrag Skull" 
                    className="footer-logo-img"
                    style={{
                        maxWidth: '250px', 
                        height: 'auto',
                        marginBottom: '1.5rem',
                        display: 'block',
                        opacity: '0.8'
                    }}
                />
            </Link>
          </div>
          <address className="footer-address">
            <p>Адрес: София, бул. Цариградско Шосе</p>
            <p>Делнични дни: 10:00 - 20:00 ч.</p>
            <p>Събота: 11:00 - 18:00 ч.</p>
            <p>Телефон: +359 888 123 456</p>
          </address>
          
          <div className="footer-socials">
            <a href="#" target="_blank" rel="noopener noreferrer">FB</a>
            <a href="#" target="_blank" rel="noopener noreferrer">IG</a>
            <a href="#" target="_blank" rel="noopener noreferrer">TW</a>
          </div>
        </div>

        {}
        <div className="footer-section">
          <h3 className="footer-heading">ПОЛЕЗНО</h3>
          <ul className="footer-links">
            <li><Link to="/">За магазина</Link></li>
            <li><Link to="/">Доставка и плащане</Link></li>
            <li><Link to="/">Замяна и връщане</Link></li>
            <li><Link to="/">Контакти</Link></li>
          </ul>
        </div>

        {}
        <div className="footer-section">
          <h3 className="footer-heading">ПРОДУКТИ</h3>
          <ul className="footer-links">
            <li><Link to="/">Ново</Link></li>
            <li><Link to="/">Дрехи</Link></li>
            <li><Link to="/">Sale</Link></li>
          </ul>
        </div>

      </div>
      
      {}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vrag Clothing. All rights reserved.</p>
      </div>
    </footer>
  );
}