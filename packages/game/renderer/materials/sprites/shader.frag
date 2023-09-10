#version 300 es
precision highp float;


in vec2 v_texcoord;

// uniforms
uniform sampler2D u_texture;




out vec4 outColor;

void main() {

  outColor = vec4(
    v_texcoord.x ,
    0.0,
    v_texcoord.y ,
    1.0
  );


  outColor = texture(u_texture, v_texcoord);


  if( outColor.a <= 0.2 )
    discard;
}
