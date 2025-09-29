# I3S Server

A lightweight, high-performance I3S (Indexed 3D Scene Service) server built with [Elysia](https://elysiajs.com/) and Bun runtime. Designed to efficiently serve 3D scene data from SLPK (Scene Layer Package) archives with minimal configuration.

## 🚀 Features

- **SLPK Archive Support**: Load and serve 3D scene data from `.slpk` archives
- **I3S Compliance**: Full compliance with Esri's Indexed 3D Scene Service specification
- **Hot Reloading**: Development server with automatic reload on file changes
- **Docker Ready**: Complete Docker support with multi-stage builds
- **File Upload**: RESTful API for uploading new scene files
- **Dynamic Loading**: Automatic archive detection and loading from specified directory
- **CORS Enabled**: Cross-origin resource sharing for web applications
- **UUID Generation**: Automatic unique service identifiers for each scene

## 📋 Prerequisites

- **Bun Runtime**: Version 1.0 or higher ([Installation Guide](https://bun.sh/))
- **Node.js**: Alternative runtime support (Node.js 18+)
- **Docker**: Optional, for containerized deployment

## 🛠️ Installation

### Using Bun (Recommended)

```bash
# Clone the repository
git clone https://github.com/Muromi-Rikka/i3s-server.git
cd i3s-server

# Install dependencies
bun install

# Start development server
bun dev
```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t i3s-server .
docker run -p 3000:3000 -v $(pwd)/scene:/scene i3s-server
```

## 📁 Project Structure

```
i3s-server/
├── src/
│   ├── controllers/
│   │   └── slpk-controller.ts      # SLPK archive management
│   ├── routes/
│   │   └── scene-server.route.ts   # API route definitions
│   ├── utils/
│   │   └── create-scene-server.ts  # Metadata generator
│   └── index.ts                   # Server entry point
├── scene/                         # SLPK files directory (auto-created)
├── docker-compose.yaml            # Docker configuration
├── Dockerfile                     # Container definition
└── package.json                   # Dependencies and scripts
```

## 🎯 Quick Start

1. **Prepare Scene Files**: Place your `.slpk` files in the `scene/` directory
2. **Start Server**: Run `bun dev` or `docker-compose up`
3. **Test Endpoints**: Access the following endpoints:
   - `GET /scene-list` - List available scenes
   - `GET /:id/SceneServer/` - Get scene metadata
   - `GET /:id/SceneServer/layers/0` - Get layer information

## 🔌 API Reference

### Scene Management

#### List Available Scenes
```http
GET /scene-list
```

**Response:**
```json
["building-scene", "terrain-model", "city-model"]
```

#### Get Scene Server Metadata
```http
GET /:sceneId/SceneServer/
```

**Response:**
```json
{
  "serviceItemId": "a1b2c3d4e5f6",
  "serviceName": "building-scene",
  "name": "building-scene",
  "currentVersion": "10.7",
  "serviceVersion": "1.8",
  "supportedBindings": ["REST"],
  "layers": [...]
}
```

#### Access Scene Resources
```http
GET /:sceneId/SceneServer/*
```

**Examples:**
- `/building-scene/SceneServer/layers/0` - Layer metadata
- `/building-scene/SceneServer/layers/0/nodes/0` - Node data
- `/building-scene/SceneServer/layers/0/nodes/0/geometries/0` - Geometry data

### File Upload

#### Upload SLPK File
```http
POST /upload
Content-Type: multipart/form-data

file: <binary SLPK file>
```

**Response:**
```
upload success
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SCENE_PATH` | Directory containing SLPK files | `./scene` |
| `PORT` | Server port | `3000` |

### Directory Structure

Create a `scene/` directory in your project root:

```
scene/
├── building-scene.slpk
├── terrain-model.slpk
└── city-model.slpk
```

The server automatically detects and loads all `.slpk` files from this directory.

## 🏗️ Development

### Available Scripts

```bash
# Development server with hot reload
bun dev

# Build production executable
bun run build

# Lint code
bun run lint

# Format code
bun run format
```

### Building for Production

```bash
# Create standalone executable
bun run build

# The executable will be created as 'server' in project root
./server
```

## 🐳 Docker Deployment

### Production Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  i3s-server:
    image: muromi-rikka/i3s-server:latest
    ports:
      - "3000:3000"
    volumes:
      - ./scene:/scene
    environment:
      - SCENE_PATH=/scene
    restart: unless-stopped
```

### Custom Configuration

```dockerfile
# Dockerfile for custom builds
FROM oven/bun:1 AS base
WORKDIR /usr/src/app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
EXPOSE 3000
ENTRYPOINT ["./server"]
```

## 🌍 Browser Support

This server is compatible with any modern web browser or 3D application that supports the I3S protocol, including:

- **ArcGIS API for JavaScript**
- **CesiumJS** (with I3S support)
- **Three.js** (with I3S loaders)
- **deck.gl** (with I3S layers)

## 📊 Performance

- **Memory Efficient**: Lazy loading of scene resources
- **Fast Startup**: Parallel archive loading
- **Scalable**: Supports multiple concurrent scene access
- **Optimized**: Built on Bun's high-performance runtime

## 🔍 Troubleshooting

### Common Issues

1. **SLPK files not loading**
   - Ensure `.slpk` files are in the `scene/` directory
   - Check file permissions and ownership
   - Verify SLPK file integrity

2. **Port already in use**
   - Change port: `PORT=3001 bun dev`
   - Or use Docker: `docker-compose up -d`

3. **CORS errors in browser**
   - CORS is enabled by default
   - Check if reverse proxy is interfering

### Debug Mode

Enable detailed logging by setting:
```bash
export DEBUG=i3s-server:*
bun dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Elysia.js](https://elysiajs.com/) - Fast and friendly web framework
- [loaders.gl](https://loaders.gl/) - 3D data loaders and utilities
- [Bun](https://bun.sh/) - Fast JavaScript runtime
- Esri - I3S specification and SLPK format

---

**Made with ❤️ by [Rikka](https://github.com/Muromi-Rikka)**