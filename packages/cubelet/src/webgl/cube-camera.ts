import { IDENTITY_QUATERNION, fromQuaternion, multiply, perspective, rotationX, rotationY, translation } from './mat4'
import type { Mat4, Quaternion } from './mat4'

const FIELD_OF_VIEW = (30 * Math.PI) / 180
const MAX_LATITUDE = Math.PI / 2 - 0.05

export interface CubeCameraOptions {
  readonly latitude?: number
  readonly longitude?: number
  readonly distance?: number
}

export class CubeCamera {
  latitude: number
  longitude: number
  distance: number
  orientation: Quaternion = IDENTITY_QUATERNION

  constructor({ latitude = 0.6, longitude = 0.55, distance = 7.9 }: CubeCameraOptions = {}) {
    this.latitude = latitude
    this.longitude = longitude
    this.distance = distance
  }

  rotate(deltaLongitude: number, deltaLatitude: number): void {
    this.longitude += deltaLongitude
    this.latitude = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, this.latitude + deltaLatitude))
  }

  projection(aspect: number): Mat4 {
    return perspective(FIELD_OF_VIEW, aspect, 0.1, 100)
  }

  view(): Mat4 {
    const orbit = multiply(rotationX(this.latitude), rotationY(-this.longitude))
    return multiply(translation(0, 0, -this.distance), multiply(orbit, fromQuaternion(this.orientation)))
  }
}
