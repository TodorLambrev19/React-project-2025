export default function About() {
    return (
        <div style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            minHeight: '100vh',
            fontFamily: 'sans-serif',
            paddingTop: '0',
            marginTop: '0'
        }}>
            <div style={{
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                marginTop: '-31px',
                height: '60vh',
                backgroundImage: 'url("/images/hero-banner2.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center 30%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                marginBottom: '4rem'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to top, #000000 10%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)',
                    zIndex: 1
                }}></div>

                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    paddingBottom: '40px'
                }}>
                    <h3 style={{
                        fontSize: '0.9rem',
                        letterSpacing: '5px',
                        textTransform: 'uppercase',
                        color: '#ddd',
                        marginBottom: '10px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                    }}>
                        Est. 2023
                    </h3>

                    <h1 style={{
                        fontSize: '4rem',
                        textTransform: 'uppercase',
                        fontWeight: '900',
                        letterSpacing: '8px',
                        color: 'white',
                        margin: 0,
                        textShadow: '0 5px 20px rgba(0,0,0,1)'
                    }}>
                        THE VISION
                    </h1>
                    <div style={{
                        width: '120px',
                        height: '3px',
                        backgroundColor: '#e63946',
                        margin: '20px auto 0 auto',
                        borderRadius: '2px'
                    }}></div>
                </div>
            </div>

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center',
                padding: '0 20px',
                paddingBottom: '5rem'
            }}>
                <div style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    color: '#cccccc',
                    marginBottom: '3rem'
                }}>
                    <p style={{ marginBottom: '1.5rem' }}>
                        <strong style={{ color: 'white' }}>VRAG CLOTHING</strong> was born in 2023. We represent the underground culture and those who dare to stand alone.
                        This is not just a brand. This is a lifestyle. We don't follow trends; we create the chaos that others follow.
                    </p>

                    <p>
                        Our philosophy is simple: <span style={{ color: '#e63946', fontWeight: 'bold' }}>LIMITED PIECES</span>.
                        High-quality fabrics. Designs that speak louder than words.
                        We make noise in a quiet world.
                    </p>
                </div>

                <div style={{
                    marginTop: '4rem',
                    borderTop: '1px solid #333',
                    paddingTop: '20px',
                    fontSize: '0.8rem',
                    color: '#666',
                    letterSpacing: '3px',
                    textTransform: 'uppercase'
                }}>
                    SOFIA BULGARIA
                </div>
            </div>
        </div>
    );
}