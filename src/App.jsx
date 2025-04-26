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

  const apiUrl = `https://boolean-spec-frontend.vercel.app/freetestapi/products?search=${search}`
  const fetchProducts = async (search) => {
    if (!search.trim()) {
      setProducts([]);
      return;
    }
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setProducts(data);
      console.log("API");
      
    } catch (err) {
      console.error(err);
    }
  };

  const debounceFetchProducts = useCallback(debounce(fetchProducts, 500), []);

  useEffect(() => {
    debounceFetchProducts(search);
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
        <div className="bg-gray-300 rounded-md p-5 w-100 mt-1">
          {products.map((p) => (
            <p key={p.id}>{p.name}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
