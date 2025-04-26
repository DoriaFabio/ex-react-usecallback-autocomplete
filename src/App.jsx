import { useEffect, useState, useCallback } from "react"

function debounce(callback, delay) {
  let timer;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  }
}

function App() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  
  const fetchProducts = async (search) => {
    if (!search.trim()) {
      setProducts([]);
      return;
    }
    const apiUrl = `https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${search}`
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const debounceFetchProducts = useCallback(debounce(fetchProducts, 500), []);

  useEffect(() => {
    debounceFetchProducts(search);
    console.log(products);
  }, [search]);

  return (
    <div className="flex justify-center m-10 flex-col items-center">
      <h1 className="text-center">Autocomplete</h1>
      <input
        type="text"
        placeholder="Cerca..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="bg-amber-100 rounded-md text-black p-2 w-100 border-2 border-amber-950"
      />
      {products.length > 0 && (
        <div className="bg-gray-300 rounded-md w-100 mt-1">
          <ul>
            {products.map((p) => (
              <li key={p.id} onClick={() => setSelectedProduct(p)} className="cursor-pointer hover:bg-gray-400 p-1 px-5 rounded-md">{p.name}</li>
            ))}
          </ul>
        </div>
      )}
      {selectedProduct && (
        <div className="bg-white border border-black rounded-2xl p-4 mt-4 w-96">
          <img src={selectedProduct.image} alt={selectedProduct.name} className="rounded-2xl" />
          <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
          <p><strong>Brand:</strong> {selectedProduct.brand}</p>
          <p><strong>Prezzo:</strong> {selectedProduct.price}</p>
          <p><strong>Descrizione:</strong> {selectedProduct.description}</p>
          <button
            onClick={() => setSelectedProduct(null)}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md"
          >
            Chiudi
          </button>
        </div>
      )}
    </div>
  )
}

export default App
