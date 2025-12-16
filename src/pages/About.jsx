export default function About() {
    return (
        <div className="about-page" style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            minHeight: '80vh', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 20px',
            textAlign: 'center'
        }}>
            <h1 style={{
                fontSize: '3.5rem',
                textTransform: 'uppercase',
                fontWeight: '900',
                letterSpacing: '5px',
                marginBottom: '2rem',
                borderBottom: '3px solid #e63946',
                paddingBottom: '10px'
            }}>
                THE VISION
            </h1>
            <div style={{
                maxWidth: '800px',
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: '#ccc',
                marginBottom: '3rem'
            }}>
                <p style={{ marginBottom: '20px' }}>
                    <strong style={{ color: 'white' }}>VRAG CLOTHING </strong> was born in 2023. 
                    We don't follow trends; we create the chaos that others follow.
                </p>

                <p style={{ marginBottom: '20px' }}>
                    Our philosophy is simple: 
                    <span style={{ color: '#e63946', fontWeight: 'bold' }}> LIMITED PIECES.</span> 
                    High-quality fabrics. Designs that speak louder than words.
                </p>

                <p>
                    We represent the underground culture,and those who dare to stand alone. 
                    This is not just a brand. This is a lifestyle.
                </p>
            </div>
            <div style={{ opacity: 0.8 }}>
               <p style={{ 
                   fontSize: '0.9rem', 
                   textTransform: 'uppercase', 
                   letterSpacing: '3px',
                   marginTop: '2rem'
               }}>
                   EST. 2025 // SOFIA BULGARIA //
               </p>
            </div>
        </div>
    );
}