import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import path from 'path'

const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yaml'))
console.log(swaggerDocument)

export default function setupSwagger(app: Express) {
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}
