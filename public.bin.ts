import { parse } from "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts";
import { decode } from "https://deno.land/std@0.69.0/encoding/ascii85.ts";
import { decompress } from "https://deno.land/x/brotli@v0.1.4/mod.ts";
export default parse(
  decompress(
    decode(
      "8?wy$-q=E{}+@@H(h4k17UCNCqAD!.6{5]#[5P5S{X:GeZAj3}KW](f.J<IUX4O#Pg{J>hmmrp:Lo!Kj5FJncQUijDliVuEu8S!:H[{WgCHr!1t=i=>%kH^>UPf9.cNB6eNgT3^[zP)74tRE<gW6+4fwa+^<6^atSeqVB5Am:nS?rkSnEgc6cg(6v3JNm-A[U}IyGqr]=A<t&mpUWc<Vsjv)wD14-<A10mfi.gG.P?yKZ12y*2K+]PTtn#68-R%YO$8JFWY>rv?V*0]7p33fn*Dq)8Wq-@og.S9B)/opqrEbp&dV=+fEch?Yk#s:grVpFe4fyxfV{ORe&<eaPDO%:1)i9bttuXA5v&+/{&i-mY<^Hg/wSibVqktQ.hg{WPS1EW+jte-BmHBaAUlds+P37asQ#g6n9ttFB$$z8lry#W<1fM%122k=@#5o!KqiuRi*%yR+7OlkqT0U*PJt1k%<)d4fNTFV*UFV88(T2a=v3^tmdR*gZuwC05P6p+=D@5S7W+zy(C6qUPgzesd6!vpZ5S1^yo=n/$QZoNKek&q/CZY&4JG+6@RAT^b+9-.s.zp9b}=!=pUgGQ9(553S><y-@{m?X6l?TsN/<9ibnsa+uo>[1[%$@Z&AKT?3-T7?J>QmiMYYOp%FuN.tKRYGT:>X>xc/<*hmq5IhEP}r0/I^o5I5b&m@/wKL3yyi?$5gt5?lH<^Ao%R3{YGByCQ7uMwX2TAC6*l@HA0@MX&R&8Kpuo!HB[19-/FdVV^19p^<U&=)%Cu6UQ/:41zKZ8e94f#rHR8-E)1+v^=C1)beEXc22fHBfCK6]kyM]<VpmuMaJaek9C1R:UgD-3&k8fT@jyOw88}qQBD?waTBIO.YOsr1{>t0BMNm2aHj3]ny$[TbVMG//2@PgnL4}<Mce]RSG9ZRVvS=EG(Sf2VF1nHFJ&lXSi&=cM=nQQ/^EgPGQ1woZCwiptKRReKeq%YLh<nT37)hpCuVpiU@e}El8./I]BL:PJx0@1S2nG&/Iso!qv3Z7>4QM{mxOH3s:dJB6W!(0<U9V/jnj(}Ol<=:^0?kj(r#OUT/HT5n1rb&${H=yoh/AQKg]J4RYR/DB51?>?z.@So*ZyJJ&>RcB%Abq$1TPmJir7x2fHrzVWbSCYZusA:twZ0m=rNv1q)Grv^XYvm45yg:t?=f&7FU^:viru}G4*FY*F1xz*p.dM95P5DOrnVm91?Z=X>l=>yOI-s!y-6N=9JtCvNfc-csrf!D{udp(Is&3Z{>npU7K{0Jr^w(zRi2VRtx1pZyYu@e?%=x>R!&k.wyTME-Gb3xeq}BUEwc0G>7EW)rYLXyFWaq@-6S[RC^:#&%-pUZTa}Smh$Xz(M@V7G=35K%5)p>ZMW%g8RKdpt+!D&PW#GpA<$VTL:v{>8yg>p13unuhE9uIOm[<vj&bFjG{MZ[{[edVOZ>A*&kdJo7[sXuKsW7a]zuWStb5!7bjl{.LwA2){",
      { standard: "Z85" },
    ),
  ),
);
