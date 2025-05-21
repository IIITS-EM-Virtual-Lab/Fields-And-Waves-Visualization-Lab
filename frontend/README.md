# Virtual Electromagnetic Laboratory  

The **Virtual Electromagnetic Laboratory** is a web-based platform designed to provide an interactive and dynamic environment for students to experiment with and visualize complex electromagnetic concepts. This project leverages modern technologies to bridge the gap between theoretical knowledge and practical applications.

---

## Features  

- Interactive visualizations of electromagnetic concepts using Geogebra.  
- Built with a modern stack: **React**, **TypeScript**, and **Vite**.  
- Hosted and deployed on **Vercel** for fast and reliable delivery.  
- Responsive and user-friendly design for multi-device compatibility.  

---

## Getting Started  

### Prerequisites  
Make sure you have the following installed:  
- **Node.js** (version 16 or later)  
- **npm** or **yarn**  

### Installation  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/your-username/virtual-electromagnetic-laboratory.git  
   ```  

2. Navigate to the project directory:  
   ```bash  
   cd virtual-electromagnetic-laboratory  
   ```  

3. Install dependencies:  
   ```bash  
   npm install  
   ```  

4. Start the development server:  
   ```bash  
   npm run dev  
   ```  

5. Open your browser and navigate to `http://localhost:5173`.  

---

## Technologies Used  

- **Frontend**: React + TypeScript + Vite  
- **Design**: Figma for UI/UX prototyping, Geogebra for interactive visualizations  
- **Deployment**: Vercel  

---

## ESLint Configuration  

This project uses ESLint for linting and follows best practices for React and TypeScript development.  

### Expanding the ESLint Configuration  

If you are developing additional features or need production-level linting, consider enabling type-aware lint rules:  

1. Update the top-level `parserOptions` property in `.eslintrc.cjs`:  
   ```js  
   export default {  
     parserOptions: {  
       ecmaVersion: 'latest',  
       sourceType: 'module',  
       project: ['./tsconfig.json', './tsconfig.node.json'],  
       tsconfigRootDir: __dirname,  
     },  
   }  
   ```  

2. Replace `plugin:@typescript-eslint/recommended` with:  
   - `plugin:@typescript-eslint/recommended-type-checked`  
   - Or `plugin:@typescript-eslint/strict-type-checked`  

3. Optionally add:  
   - `plugin:@typescript-eslint/stylistic-type-checked`  

4. Install `eslint-plugin-react` and add the following to the `extends` list:  
   - `plugin:react/recommended`  
   - `plugin:react/jsx-runtime`  

---

## Deployment  

The project is deployed on **Vercel**. Access the live version here: [Virtual Electromagnetic Laboratory](https://em-virtual-laboratory.vercel.app).  

---

## Contributors  

- **H S R S Subrahmanyam Bitra**: Development and Geogebra integration.  
- **Nasari Nitish**: Content curation and UI/UX design.  

---

## License  

This project is licensed under the [MIT License](LICENSE).  