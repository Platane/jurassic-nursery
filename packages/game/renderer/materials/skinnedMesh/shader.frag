#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_color;


out vec4 outColor;

void main() {

  vec3 l = vec3(0.615457,0.492365 ,0.615457);


  vec3 normal = normalize(v_normal);

  float p = dot(normal, l) ;


  
  outColor.rgba = vec4( v_color, 1.0 );

  outColor.rgb *= 0.6 + clamp(  p, -0.47, 10.0 ) * 0.45  ;
  
  // outColor.rgb = v_normal;
  // outColor.rgb = vec3(0.615457,0.492365 ,0.615457);

  
}
