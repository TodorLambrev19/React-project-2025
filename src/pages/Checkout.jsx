import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../api/orders';
import { getAllCities, getOfficeCities, getOffices, searchStreets } from '../api/econt';

const STEPS = ['Details', 'Delivery', 'Payment'];

export default function Checkout() {
    const { cartItems, totalPrice, clearCart } = useCart();

    const [step, setStep] = useState(1);

    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [deliveryMethod, setDeliveryMethod] = useState('office');

    const [allCities, setAllCities] = useState([]);
    const [officeCities, setOfficeCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(false);

    const [selectedCity, setSelectedCity] = useState(null);
    const [officeOptions, setOfficeOptions] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);

    const [selectedAddressCity, setSelectedAddressCity] = useState(null);
    const [streetTerm, setStreetTerm] = useState('');
    const [streetOptions, setStreetOptions] = useState([]);
    const [selectedStreet, setSelectedStreet] = useState(null);
    const [addressDetails, setAddressDetails] = useState('');

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Load the Econt city lists once, the first time the delivery step is reached:
    // office pickup only offers cities that actually have an Econt office,
    // home delivery offers every city/settlement Econt serves.
    useEffect(() => {
        if (step !== 2 || allCities.length > 0 || citiesLoading) return;
        setCitiesLoading(true);
        Promise.all([getOfficeCities(), getAllCities()])
            .then(([offices, all]) => {
                setOfficeCities(offices);
                setAllCities(all);
            })
            .catch(err => {
                console.error('City list failed to load:', err);
                setError('Could not load the list of cities. Please refresh and try again.');
            })
            .finally(() => setCitiesLoading(false));
    }, [step, allCities.length, citiesLoading]);

    // Street lookup (real Econt nomenclature, scoped to selected address city)
    useEffect(() => {
        if (!selectedAddressCity || streetTerm.trim().length < 2) {
            setStreetOptions([]);
            return;
        }
        const timeout = setTimeout(async () => {
            try {
                setStreetOptions(await searchStreets(selectedAddressCity.id, streetTerm.trim()));
            } catch (err) {
                console.error('Street lookup failed:', err);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [streetTerm, selectedAddressCity]);

    const handleSelectCity = async (city) => {
        setSelectedCity(city);
        setSelectedOffice(null);
        setOfficeOptions([]);
        if (!city) return;
        try {
            setOfficeOptions(await getOffices(city.id));
        } catch (err) {
            console.error('Office lookup failed:', err);
            setError('Could not load Econt offices for this city. Please try again.');
        }
    };

    const handleSelectAddressCity = (city) => {
        setSelectedAddressCity(city);
        setSelectedStreet(null);
        setStreetTerm('');
        setStreetOptions([]);
    };

    const handleSelectStreet = (street) => {
        setSelectedStreet(street);
        setStreetOptions([]);
        setStreetTerm(street.name);
    };

    const goBack = () => {
        setError('');
        setStep(s => Math.max(1, s - 1));
    };

    const handlePrimaryAction = async (e) => {
        e.preventDefault();
        setError('');

        if (step === 1) {
            if (!customerName.trim() || !email.trim() || !phone.trim()) {
                setError('Please fill in your name, email and phone number.');
                return;
            }
            if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
                setError('Please enter a valid email address.');
                return;
            }
            setStep(2);
            return;
        }

        if (step === 2) {
            if (deliveryMethod === 'office' && !selectedOffice) {
                setError('Please select an Econt office.');
                return;
            }
            if (deliveryMethod === 'address' && (!selectedAddressCity || !selectedStreet || !addressDetails.trim())) {
                setError('Please select your city, street, and enter a street number.');
                return;
            }
            setStep(3);
            return;
        }

        setSubmitting(true);
        try {
            const id = await createOrder({
                items: cartItems.map(item => ({
                    productId: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size || null,
                })),
                totalPrice,
                customer: { name: customerName.trim(), email: email.trim(), phone: phone.trim() },
                delivery: deliveryMethod === 'office'
                    ? {
                        method: 'office',
                        cityName: selectedCity.name,
                        officeId: selectedOffice.id,
                        officeName: selectedOffice.name,
                    }
                    : {
                        method: 'address',
                        cityName: selectedAddressCity.name,
                        address: `${selectedStreet.name}, ${addressDetails.trim()}`,
                    },
            });
            setOrderId(id);
            clearCart();
        } catch (err) {
            console.error('Order creation failed:', err);
            setError('Something went wrong placing your order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (orderId) {
        return (
            <div className="checkout-status-card">
                <div className="checkout-status-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </div>
                <h2>Order placed</h2>
                <p>
                    Thank you, {customerName}. Your order has been received. Pay in cash when
                    the Econt courier delivers it. We&apos;ll contact you at {phone} to confirm.
                </p>
                <Link to="/shop" className="checkout-status-link">
                    Back to shop
                </Link>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="checkout-status-card">
                <p style={{ color: '#888', marginBottom: '1.5rem' }}>Your cart is empty.</p>
                <Link to="/shop" className="checkout-status-link">
                    Continue shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h2 className="checkout-title">Checkout</h2>

            <div className="checkout-steps">
                {STEPS.map((label, i) => {
                    const n = i + 1;
                    return (
                        <div key={label} style={{ display: 'contents' }}>
                            <div className={`checkout-step ${step === n ? 'active' : ''} ${step > n ? 'done' : ''}`}>
                                <span className="checkout-step-circle">
                                    {step > n ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    ) : n}
                                </span>
                                <span className="checkout-step-label-text">{label}</span>
                            </div>
                            {n < STEPS.length && <div className="checkout-step-line" />}
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handlePrimaryAction} className="checkout-layout">
                <div className="checkout-form-col">
                    {step === 1 && (
                        <section className="checkout-section">
                            <p className="checkout-step-label">01 — Contact Details</p>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="tel"
                                    placeholder="Phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </section>
                    )}

                    {step === 2 && (
                        <section className="checkout-section">
                            <p className="checkout-step-label">02 — Delivery</p>
                            <div className="delivery-options">
                                <label className={`delivery-option ${deliveryMethod === 'office' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        checked={deliveryMethod === 'office'}
                                        onChange={() => setDeliveryMethod('office')}
                                    />
                                    <strong>Econt Office</strong>
                                    <small>Pick up from a courier office</small>
                                </label>
                                <label className={`delivery-option ${deliveryMethod === 'address' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        checked={deliveryMethod === 'address'}
                                        onChange={() => setDeliveryMethod('address')}
                                    />
                                    <strong>Home Delivery</strong>
                                    <small>Deliver to your address</small>
                                </label>
                            </div>

                            {deliveryMethod === 'office' ? (
                                <>
                                    <div className="form-group">
                                        <select
                                            value={selectedCity?.id ?? ''}
                                            onChange={(e) => handleSelectCity(
                                                officeCities.find(c => String(c.id) === e.target.value) || null
                                            )}
                                        >
                                            <option value="" disabled>
                                                {citiesLoading ? 'Loading cities…' : 'Select your city'}
                                            </option>
                                            {officeCities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedCity && (
                                        <div className="form-group">
                                            <select
                                                value={selectedOffice?.id ?? ''}
                                                onChange={(e) => setSelectedOffice(
                                                    officeOptions.find(o => String(o.id) === e.target.value) || null
                                                )}
                                            >
                                                <option value="" disabled>Select an Econt office</option>
                                                {officeOptions.map(office => (
                                                    <option key={office.id} value={office.id}>{office.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <select
                                            value={selectedAddressCity?.id ?? ''}
                                            onChange={(e) => handleSelectAddressCity(
                                                allCities.find(c => String(c.id) === e.target.value) || null
                                            )}
                                        >
                                            <option value="" disabled>
                                                {citiesLoading ? 'Loading cities…' : 'Select your city'}
                                            </option>
                                            {allCities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedAddressCity && (
                                        <div className="form-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                placeholder="Search for your street"
                                                value={streetTerm}
                                                onChange={(e) => {
                                                    setStreetTerm(e.target.value);
                                                    setSelectedStreet(null);
                                                }}
                                            />
                                            {streetOptions.length > 0 && (
                                                <ul className="checkout-autocomplete">
                                                    {streetOptions.map(street => (
                                                        <li key={street.id} onClick={() => handleSelectStreet(street)}>
                                                            {street.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}

                                    {selectedStreet && (
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                placeholder="Street number, entrance, floor, apartment"
                                                value={addressDetails}
                                                onChange={(e) => setAddressDetails(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    )}

                    {step === 3 && (
                        <section className="checkout-section">
                            <p className="checkout-step-label">03 — Payment</p>
                            <div className="payment-badge">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="6" width="20" height="12" rx="2" />
                                    <path d="M2 10h20" />
                                </svg>
                                <span>Cash on delivery — pay when your order arrives</span>
                            </div>
                            <div className="checkout-review">
                                <p><span>Name</span><span>{customerName}</span></p>
                                <p><span>Email</span><span>{email}</span></p>
                                <p><span>Phone</span><span>{phone}</span></p>
                                <p>
                                    <span>Delivery</span>
                                    <span>
                                        {deliveryMethod === 'office'
                                            ? `${selectedOffice?.name}, ${selectedCity?.name}`
                                            : `${selectedStreet?.name} ${addressDetails}, ${selectedAddressCity?.name}`}
                                    </span>
                                </p>
                            </div>
                        </section>
                    )}

                    {error && <div className="checkout-error">{error}</div>}

                    <div className="checkout-actions">
                        {step > 1 && (
                            <button type="button" className="checkout-back-btn" onClick={goBack}>
                                ← Back
                            </button>
                        )}
                        <button type="submit" className="submit-btn checkout-submit" disabled={submitting}>
                            {step < 3 ? 'Continue →' : (submitting ? 'Placing order…' : 'Place Order')}
                        </button>
                    </div>
                </div>

                <div className="checkout-summary-col">
                    <div className="checkout-summary-card">
                        <h3>Order Summary</h3>
                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div className="summary-item" key={`${item.id}-${item.size || ''}`}>
                                    <img src={item.imageUrl} alt={item.title} />
                                    <div className="summary-item-info">
                                        <p className="summary-item-title">{item.title}</p>
                                        <p className="summary-item-meta">
                                            {item.size ? `Size: ${item.size} · ` : ''}Qty {item.quantity}
                                        </p>
                                    </div>
                                    <p className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-total-row">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <p className="summary-note">Cash on delivery — no payment needed now</p>
                    </div>
                </div>
            </form>
        </div>
    );
}
