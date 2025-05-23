# PixelSpark AI Image Generator Studio ✨

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Generate stunning icons, banners, and images for your projects with AI. Describe your vision, choose your formats, and let PixelSpark create multiple options for you to refine and download. PixelSpark uses Google's Gemini API to create high-quality images from text prompts, with a streamlined workflow for selecting, resizing, and downloading your perfect visuals.

## Try It Online

You can try out PixelSpark instantly at: [https://pixelspark.vercel.app](https://pixelspark.vercel.app)

If you prefer, you can also self-host or deploy your own instance using the instructions below.

## Features

- **AI-Powered Image Generation**: Create stunning images from text prompts using Google's Imagen AI models.
- **Multi-Step Workflow**: Intuitive 3-step process: prompt input → image selection → finalize & download.
- **Aspect Ratio/Format Control**: Choose from multiple aspect ratios or formats including Square (1:1), Banner (16:9), Portrait (4:5), and Cover (3:1).
- **Multiple Size Variants**: Generate various size versions of your selected images automatically.
- **Batch Processing**: Select multiple generated images to process in a single operation.
- **ZIP Download**: Conveniently download all processed images as a single ZIP archive.
- **User-Provided API Key**: Securely use your own Google Gemini API key (stored locally in your browser).
- **Modern UI**: Clean, responsive interface with a focus on usability.
- **Completely Open Source**: Available on GitHub under the MIT license. Feel free to explore the code, contribute, provide feedback, or report issues on our [GitHub repository](https://github.com/sukarth/pixelspark).

## Preview

![PixelSpark Home Page Preview Screenshot](./assets/screenshot1.png)
*Main interface showing the image generation workflow*

## Getting Started

Everything you need to install, run, and deploy PixelSpark.

### Prerequisites
- Node.js (v16+)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Local Installation

1. **Clone the Repository**:
   ```pwsh
   git clone https://github.com/sukarth/pixelspark.git
   cd pixelspark
   ```
2. **Install Dependencies**:
   ```pwsh
   npm install
   ```
3. **Run the Development Server**:
   ```pwsh
   npm run dev
   ```
4. **Access the App**:
   - Open your browser and go to: `http://localhost:5173/`
   - You'll be prompted to enter your Gemini API key on first launch

### Deployment

#### Deploy to Vercel
1. Fork this repository to your GitHub account
2. Sign in to [Vercel](https://vercel.com) with your GitHub account
3. Click "New Project" and select your forked repository
4. Use default settings (Vite framework preset) and click "Deploy"

#### Deploy Anywhere
The app is built with Vite and can be deployed to any static hosting service:

1. Build the production version:
   ```pwsh
   npm run build
   ```
2. The `dist` folder contains the deployable static files
3. Upload to any static hosting service (Netlify, GitHub Pages, etc.)

## Usage

Follow these steps to generate and download images:

### 1. Provide API Key
- Enter your Gemini API key in the Settings modal when prompted
- Your API key is stored locally in your browser and never sent to any server

### 2. Generate Images
- Enter a detailed text prompt describing the image you want to create, or choose one of the sample prompts by pressing 'tab' on the one you like
- Select your preferred aspect ratio (Square, Banner, Portrait, or Cover)
- Choose which size variants of the image you want to generate
- Click "Generate" to create your images

### 3. Select Images
- Review the generated images and select the ones you like
- You can regenerate the images, or send a follow-up prompt to refine the image generations
- Or, you can proceed to finalization

### 4. Finalize and Download
- Review all selected images with their size variations (hover over variants to show image previews)
- Download individual images or all of them as a ZIP archive or separate file downloads

## Technical Details

A quick look at how PixelSpark works under the hood.

### Project Structure
- **React Frontend**: Built with React and TypeScript
- **Google Gemini API**: Uses Google's Gemini AI service for image generation
- **Local Processing**: All image processing (resizing, cropping) happens locally in the browser
- **No Server Required**: Fully client-side application with no backend dependencies

### Size Variants
- **Square (1:1)**: 256x256, 128x128, 96x96, 64x64, 48x48, 32x32, 24x24, 16x16
- **Banner (16:9)**: 1920x1080, 1280x720, 960x540, 640x360
- **Portrait (4:5)**: 1080x1350, 800x1000, 400x500
- **Cover (3:1)**: 1500x500, 1200x400, 900x300

## Troubleshooting / FAQ

- **Q: I get an "Invalid API Key" error**
  - A: Ensure you've entered the correct API key from Google's MakerSuite.
- **Q: The image generation is failing**
  - A: Ensure your prompt doesn't violate Google's content policies. Try a different prompt or simplify the existing one.
- **Q: I hit my API quota limit**
  - A: Google Gemini API has usage limits. Check your Google Cloud Console to review your quota and usage.
- **Q: Some aspects of the generated images don't match my prompt**
  - A: AI image generation is still evolving. Try using more specific descriptions or adjust your prompt with more details.

## Contributing

Contributions, feedback, and bug reports are welcome! Please feel free to open an issue, provide feature suggestions/improvements, or submit a pull request on the GitHub repository.

### Development
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/pixelspark.git`
3. Install dependencies: `npm install`
4. Create a branch for your feature: `git checkout -b feature-awesome`
5. Make your changes and commit: `git commit -m "Add awesome feature"`
6. Push to your fork: `git push origin feature-awesome`
7. Create a Pull Request

## License

This project is licensed under the [MIT License](https://github.com/sukarth/pixelspark/blob/main/LICENSE).

---

Made with ❤️ by Sukarth Acharya
