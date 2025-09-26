import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl max-w-xl mx-auto mt-12">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-purple-700 animate-pulse">
        Get in Touch
      </h1>
      <p className="text-lg mb-6 text-center text-gray-700">
        Have questions, ideas, or just want to say hello? We'd love to hear from you! 💌
      </p>

      {submitted && (
        <p className="mb-4 text-center text-green-600 font-semibold animate-bounce">
          Thank you! Your message has been sent. 🎉
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          required
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transform hover:scale-105 transition"
        >
          Send Message
        </button>
      </form>

      <p className="mt-6 text-center text-gray-500 text-sm">
        Or reach us directly at{" "}
        <a
          href="mailto:mdjyaulhaque9934@gmail.com"
          className="text-purple-500 font-semibold hover:underline"
        >
          mdjyaulhaque9934@gmail.com
        </a>
      </p>

      <p className="mt-2 text-center text-gray-500 text-sm">
        Connect with me on{" "}
        <a
          href="https://www.linkedin.com/in/mdjyaulhaque/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-semibold hover:underline"
        >
          LinkedIn
        </a>
      </p>
    </div>
  );
}
