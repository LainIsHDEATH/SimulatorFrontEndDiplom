import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {API} from "../../api";

export default function RegisterPage() {
  const [form, set] = useState({username: "", email: "", password: ""});
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await API.register(form);
    navigate("/dashboard");     // безопасный переход через React Router
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-sm w-full mx-auto p-6 bg-white shadow rounded">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Регистрация</h2>
          <form onSubmit={submit} className="space-y-3">
            {["username", "email", "password"].map(k => (
              <input key={k} required type={k === "password" ? "password" : "text"}
                     placeholder={k} className="w-full border p-2 rounded"
                     value={form[k]} onChange={e => set({...form, [k]: e.target.value})}/>
            ))}
            <button className="w-full bg-blue-600 text-white py-2 rounded">Зарегистрироваться</button>
          </form>
        </div>
      </div>
    </div>
  );
}