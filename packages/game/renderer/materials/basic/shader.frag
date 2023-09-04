#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_color;


out vec4 outColor;

void main() {

  vec3 staticLightDirection = vec3(0.615457,0.492365 ,0.615457);


  float staticLightPower = dot(v_normal, staticLightDirection) ;


  
  outColor.rgba = vec4( v_color, 0.7 );

  outColor.rgb *= 0.6 + clamp(  staticLightPower, -0.47, 10.0 ) * 0.45  ;
  
  // outColor.rgb = v_normal;

  
}
