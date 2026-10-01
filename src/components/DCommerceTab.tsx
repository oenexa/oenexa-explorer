import React, { useState } from 'react'

interface DeliveryOrder {
  id: string
  restaurant: string
  buyer: string
  courier: string
  foodOen: number
  deliveryOen: number
  status: 'CREATED' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED'
  pickupHash: string
  dropoffHash: string
  createdAt: string
}

const INITIAL_ORDERS: DeliveryOrder[] = [
  {
    id: 'ORD-9842',
    restaurant: 'GreenLeaf Organic Kitchen (0x7f4a...92b1)',
    buyer: '0x3a8c...10f2',
    courier: '0x9921...e45a',
    foodOen: 25.5,
    deliveryOen: 4.5,
    status: 'ACCEPTED',
    pickupHash: '0x88f2...c3d1',
    dropoffHash: '0x44a1...e990',
    createdAt: '5 mins ago',
  },
  {
    id: 'ORD-9841',
    restaurant: 'Artisan Woodfire Pizzeria (0x11e4...77c3)',
    buyer: '0x55bc...33aa',
    courier: '0x9921...e45a',
    foodOen: 32.0,
    deliveryOen: 5.0,
    status: 'PICKED_UP',
    pickupHash: '0x12ab...90ef',
    dropoffHash: '0x77cd...33bb',
    createdAt: '18 mins ago',
  },
  {
    id: 'ORD-9840',
    restaurant: 'Tokyo Fresh Ramen Bar (0x88cd...5512)',
    buyer: '0x22de...99ff',
    courier: '0x44fa...1100',
    foodOen: 18.0,
    deliveryOen: 3.5,
    status: 'DELIVERED',
    pickupHash: '0xaa12...bb34',
    dropoffHash: '0xcc56...dd78',
    createdAt: '42 mins ago',
  },
]

export const DCommerceTab: React.FC = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>(INITIAL_ORDERS)
  const [restaurantName, setRestaurantName] = useState('GreenLeaf Kitchen')
  const [foodCost, setFoodCost] = useState('24.0')
  const [deliveryTip, setDeliveryTip] = useState('4.0')
  const [orderCreated, setOrderCreated] = useState(false)
  const [activeActionMsg, setActiveActionMsg] = useState<string | null>(null)

  const handleCreateOrder = () => {
    const food = parseFloat(foodCost) || 0
    const tip = parseFloat(deliveryTip) || 0
    if (food <= 0) return

    const newOrder: DeliveryOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurant: `${restaurantName} (0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)})`,
      buyer: '0xUserWallet...Self',
      courier: 'Awaiting Courier Acceptance',
      foodOen: food,
      deliveryOen: tip,
      status: 'CREATED',
      pickupHash: '0x' + Math.random().toString(16).slice(2, 10),
      dropoffHash: '0x' + Math.random().toString(16).slice(2, 10),
      createdAt: 'Just now',
    }

    setOrders([newOrder, ...orders])
    setOrderCreated(true)
    setTimeout(() => setOrderCreated(false), 4000)
  }

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        if (o.status === 'CREATED') {
          setActiveActionMsg(`Courier accepted order ${orderId}! Heading to restaurant.`)
          return { ...o, status: 'ACCEPTED', courier: '0xCourier...9921' }
        }
        if (o.status === 'ACCEPTED') {
          setActiveActionMsg(`Pickup QR verified for ${orderId}! Food handed to courier.`)
          return { ...o, status: 'PICKED_UP' }
        }
        if (o.status === 'PICKED_UP') {
          setActiveActionMsg(
            `Dropoff QR scanned! ${orderId} delivered. Atomic settlement: ${o.foodOen} OEN → Restaurant, ${o.deliveryOen} OEN → Courier. ZERO platform fees.`
          )
          return { ...o, status: 'DELIVERED' }
        }
        return o
      })
    )
    setTimeout(() => setActiveActionMsg(null), 5000)
  }

  return (
    <section className="tab-pane">
      <div className="tab-header">
        <div>
          <h2 className="tab-title">Decentralized Everyday Commerce (D-Commerce)</h2>
          <p className="tab-subtitle">
            Zero-Trust Physical Delivery Escrow & Micro-Merchant POS with Zero Platform Fees
          </p>
        </div>
        <span className="badge success">0% Middleman Extraction</span>
      </div>

      <div className="metrics-grid mb-4">
        <div className="metric-card">
          <span className="metric-label">Escrow Commission</span>
          <span className="metric-value highlight">0.0%</span>
          <span className="metric-foot">vs 25-30% Web2 delivery apps</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Handoff Security</span>
          <span className="metric-value">2FA QR Proof</span>
          <span className="metric-foot">Cryptographic preimage verification</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Atomic Settlement</span>
          <span className="metric-value text-green">&lt; 2.0s</span>
          <span className="metric-foot">Instant PBFT block finality</span>
        </div>
      </div>

      {orderCreated && (
        <div className="alert-box success mb-4">
          <span>✅ D-Commerce Delivery Escrow Created! Funds locked in Wazero WASM contract.</span>
        </div>
      )}

      {activeActionMsg && (
        <div className="alert-box info mb-4">
          <span>⚡ {activeActionMsg}</span>
        </div>
      )}

      <div className="swap-card-container">
        {/* Left: Place Food/Commerce Order */}
        <div className="card">
          <h3 className="card-title">Place Zero-Commission Delivery Order</h3>
          <p className="tab-subtitle mb-3">100% of payment goes directly to local restaurants and couriers</p>

          <div className="form-group mb-3">
            <label htmlFor="restaurant-input">Merchant / Restaurant:</label>
            <input
              id="restaurant-input"
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-grid mb-3">
            <div className="form-group">
              <label htmlFor="food-cost">Food / Item Cost (OEN):</label>
              <input
                id="food-cost"
                type="number"
                min="1"
                step="0.5"
                value={foodCost}
                onChange={(e) => setFoodCost(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="delivery-fee">Direct Courier Tip (OEN):</label>
              <input
                id="delivery-fee"
                type="number"
                min="1"
                step="0.5"
                value={deliveryTip}
                onChange={(e) => setDeliveryTip(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="swap-meta mt-3">
            <div className="meta-row">
              <span>Restaurant Payment:</span>
              <span>{foodCost} OEN (100% Net)</span>
            </div>
            <div className="meta-row">
              <span>Courier Delivery Fee:</span>
              <span>{deliveryTip} OEN (100% Net)</span>
            </div>
            <div className="meta-row">
              <span>Platform Take-Rate:</span>
              <span className="text-green font-bold">0.00 OEN (0.0%)</span>
            </div>
            <div className="meta-row">
              <span>Total Escrow Lock:</span>
              <span className="text-cyan font-bold">
                {(parseFloat(foodCost || '0') + parseFloat(deliveryTip || '0')).toFixed(2)} OEN
              </span>
            </div>
          </div>

          <button onClick={handleCreateOrder} className="btn primary full-width mt-3">
            🛵 Lock Funds & Place Escrow Order
          </button>
        </div>

        {/* Right: Active Delivery Escrows */}
        <div className="card">
          <h3 className="card-title">Live Physical Delivery Pipeline</h3>
          <p className="tab-subtitle mb-3">Cryptographic QR handoff stages on OENEXA Layer-1</p>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong>{o.id}</strong>
                      <div className="order-restaurant">{o.restaurant}</div>
                      <div className="metric-foot">{o.createdAt}</div>
                    </td>
                    <td>
                      <div>{(o.foodOen + o.deliveryOen).toFixed(1)} OEN</div>
                      <div className="metric-foot">Tip: {o.deliveryOen} OEN</div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          o.status === 'DELIVERED'
                            ? 'success'
                            : o.status === 'PICKED_UP'
                            ? 'info'
                            : 'secondary'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td>
                      {o.status === 'CREATED' && (
                        <button
                          onClick={() => advanceOrderStatus(o.id)}
                          className="btn-sm primary"
                        >
                          Accept Courier
                        </button>
                      )}
                      {o.status === 'ACCEPTED' && (
                        <button
                          onClick={() => advanceOrderStatus(o.id)}
                          className="btn-sm success"
                        >
                          Scan Pickup QR
                        </button>
                      )}
                      {o.status === 'PICKED_UP' && (
                        <button
                          onClick={() => advanceOrderStatus(o.id)}
                          className="btn-sm primary"
                        >
                          Scan Dropoff QR
                        </button>
                      )}
                      {o.status === 'DELIVERED' && (
                        <span className="text-green text-sm">✓ Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
