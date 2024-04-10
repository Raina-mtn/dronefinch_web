export function flyTo (camera, target, duration, distance) {
  distance = distance || 10;
  return new Promise((resolve) => {
    const direction = camera.direction;
    if (duration === 0) {
      camera.setView({
        destination: Cesium.Cartesian3.add(target, Cesium.Cartesian3.multiplyByScalar(direction, -distance, new Cesium.Cartesian3()), new Cesium.Cartesian3()),
        orientation: {
          direction,
          up: camera.up,
        },
      });
      resolve();
    } else {
      Cesium.Cartesian3.normalize(direction, direction);
      camera.flyTo({
        destination: Cesium.Cartesian3.add(target, Cesium.Cartesian3.multiplyByScalar(direction, -distance, new Cesium.Cartesian3()), new Cesium.Cartesian3()),
        orientation: {
          direction,
          up: camera.up,
        },
        duration,
      });
      setTimeout(() => {
        resolve();
      }, duration * 1000);
    }

  });

}

export function getCatesian3FromPX (viewer, px) {
  if (viewer && px) {
    const picks = viewer.scene.drillPick(px);
    let cartesian:any = null;
    let isOn3dtiles = false,
      isOnTerrain = false;
    // drillPick
    for (const i in picks) {
      const pick = picks[i];

      if ((pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) || (pick && pick.primitive instanceof Cesium.Cesium3DTileset) || (pick && pick.primitive instanceof Cesium.Model)) {
        //模型上拾取
        isOn3dtiles = true;
      }
      // 3dtilset
      if (isOn3dtiles) {
        viewer.scene.pick(px); // pick
        cartesian = viewer.scene.pickPosition(px);
        if (cartesian) {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          if (cartographic.height < 0) cartographic.height = 0;
          const lon = Cesium.Math.toDegrees(cartographic.longitude),
            lat = Cesium.Math.toDegrees(cartographic.latitude),
            height = cartographic.height;
          cartesian = transformWGS84ToCartesian({
            lng: lon,
            lat: lat,
            alt: height,
          });
        }
      }
    }
    // 地形
    const boolTerrain = viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider;
    // Terrain
    if (!isOn3dtiles && !boolTerrain) {
      const ray = viewer.scene.camera.getPickRay(px);
      if (!ray) return null;
      cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      isOnTerrain = true;
    }
    // 地球
    if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
      cartesian = viewer.scene.camera.pickEllipsoid(px, viewer.scene.globe.ellipsoid);
    }
    if (cartesian) {
      const position = transformCartesianToWGS84(cartesian);
      if (position.alt < 0) {
        cartesian = transformWGS84ToCartesian(position, 0.1);
      }
      return cartesian;
    }
    return false;
  }
}

/***
 * 坐标转换 84转笛卡尔
 * @param {Object} {lng,lat,alt} 地理坐标
 * @return {Object} Cartesian3 三维位置坐标
 */
export function transformWGS84ToCartesian (position, alt?:number) {
  return position ? Cesium.Cartesian3.fromDegrees(position.lng || position.lon, position.lat, (position.alt = alt || position.alt), Cesium.Ellipsoid.WGS84) : Cesium.Cartesian3.ZERO;
}

/***
 * 坐标转换 笛卡尔转84
 * @param {Object} Cartesian3 三维位置坐标
 * @return {Object} {lng,lat,alt} 地理坐标
 */
export function transformCartesianToWGS84 (cartesian) {
  const ellipsoid = Cesium.Ellipsoid.WGS84;
  const cartographic = ellipsoid.cartesianToCartographic(cartesian);
  return {
    lng: Cesium.Math.toDegrees(cartographic.longitude),
    lat: Cesium.Math.toDegrees(cartographic.latitude),
    alt: cartographic.height,
  };
}

//角度转弧度
export function degToRad (deg) {
  return Math.PI * 2 * (deg / 360);
}

//弧度转角度
export function radToDeg (rad) {
  return rad * (360 / (Math.PI * 2));
}