import { parse } from "https://git.rory.no/trgwii/Bundler/raw/branch/master/parse.ts";
import { decode } from "https://deno.land/std@0.74.0/encoding/ascii85.ts";
import { decompress } from "https://deno.land/x/brotli@v0.1.4/mod.ts";
export default parse(
  decompress(
    decode(
      "8)ZgT-q-^*fgsV/)v]18pt^VbiZ?605r^>WEO@#xh#>iAHHKn]S:iacZXi2lerE0mTp{>:Qh}%N47#Qb2!I3BsX%%l+0.K^}BpcjtXivKqvn0(@=wD%QwDto8iwL2sKTZ05S.v+Z3]xiQgipsIC/ORT4o+<miIZ}:]RVutSKh+oYg^FEteHl>w)3o1^J5KYT.QM<%XQ9s1*MF^Zw0Gmth/PB$vnvdxIRFFx5V9S-bMIdG+AgWO!.qX*I(oZ=ZHrAfMi]bMS@sEA#<zF{v5YoEsQ2mP%2x0p$KW=4B]&[EA2{[bV3qDcp}VBF-GoJJGvcX2*kXFz9U%kVNEF0q4jRx9:Uvvf$!.@W^S[59pJQMrMqf.pB-o!(7Y]r-AOJk<n4{(Z2)SD49$1Ae:$h/-ZT!27rEl2@kz7q}C-FYC4PK(J>T-]hTKn)Dg>6i<ShiCcb-0{0hn[{E:2.UhL=V{fexb1PfL+am&ld7$WVnsU)CoPPQT8CeoO^&SB4cx$HXnb!uZx76uay=)5rX/*)!wHN*xD=dHUq10VnhD55iT5MHKYff<4mOTB:{phynZ]p(j?s8&EvW#5vTF=.v<+6IccJz=A^9j)DaR]]h{D>PhOk&g)-a9)y{TVwys2]:Ge5/k0#{Z-Pc1T!-vkl$Cksnwyi+[Kn<@@9UQsQIhm**N@5+l%1Yj(x6*^x:-6dWNC.r[]-qjMbSh87Fn<8e1QLU/noFlb<9mh!6ZxLmsB{d/<o5p{d[X5tE+0n50%$1ru=-tU-5FA<5@sy&8fD(W]*LF-xD2c$AgqYSl2[T9&+h22uMSNMZWwSKjHFokGvcEpJR+!VJzS!RjT@CMSD(HMHHmO92ru*zaj2]Cxr{6E.2)leS7Itvwd?oU4db)IqEh@oU/-}C[fXQ<@L)RbW]daeF!Mjre(nY0y#bpo![H9uk3[O4GYb?LPkgJaF{?gL!c=}AwP<hlbGJ}hr+mf7.ItZQ#K/eT>zy5?#y6KIHW+>?MvBh+7p%plWx0XS.<NA$7B)w#+c1CGCItZ[xN0iyPa<Njb}.O=VQ-GYpYiCldt7(ZB^wFV%yy%9?=tbvwLidxEA*e9$EE?5aGe.l4}gHP7cG=3d4Adr&g[^Z[ff9ycweE+=u!qTtm!*vAvjGNNs?Q!gH<S==7%2*jXph.+OG5WqKbpm#c0P)XIi?]^#F[qe<zknkOg(zY)WQ?A@h3C9xWdXR2V}m$sGU?#!4K]:km><y@?N5wC]2I8mD9Oqzg]Y8TFr:npqC}J76FFGiIIRVb}1wL*J^hjsg95O05m:nfC3Fh-CT!-YGo>xfp?Gml%dB(NHfsngEaA+kcy2^-%T4t^$u@PDTN@b].)awPfF5>8%>z]H2:)]z]0jf>$n5:fS*VJyMCY!d%^Y7VV)v/{5:Xwa]NWA(>X=)^Z-G^/RKFJUqYdaj>Sv[3VG@i8zS>o*.cPNlSRA7f!T}VD5Nd[3AMhOy&n^MdfVGz)UqUmD$E5ZnFKLOvg<xnAzqz{2f.V>kBIE-J:k+GMtgZ=?0xkgABq<bS#!sQ8TKgrPc7L{r40>u-G.^}=2Cn[.<=Yw^svh!<@G7DFDe0R6Fu/Z9PL3MK>ubDtZR#MYjz6yj4u$Q]<JT!UzUJS/fC>N>MgyRS^PDidm/!&CRqj6ynyzljbo90ACC&h/U:wFT>^7R#UsUet!bY-a(q8&Z$[N=AIly(1%l2I{OpaEof:DM-Kc2E80.+WS1HdF>*IfQ?08uz=kYd%9J8>)XEm]^Dil9sIhQp{5CyHN+W)]486s*76#GxC7*8IQ)ze<0mQR^rqP9Nwm#iw1h@XUmR/FC6AosIY.l*:/)d4]+!IvJ-vOa>Xa<XhBtMfr9+S9Q&bxqG1-*OHY*b-(X^O(RGKUTPo/5mMowU+Gp1&SQV(y@hb3*y3&*jJuHpuIlY!?yfO/@&sVeAdKc/l&a]6Ob/8nAVSiPtv3AgHf*KLyIIWD6:?1Awm%jjF.3&^+g]v^MOp?ntj&mw@fqp:8wkl%SSG^?4QR3OzqVdA[QOB1jBK[}F:n4zN2?ww=?}5]#/fpll9d?)S^/1-0!q.J3GY%7NQrQ=H!<:Tr}4.8rz]yQ${F4/w+C[JH/@#T#7{T9BJzGJ}xAbv?+B:pWq#O4(L0u1ZE!@xd9eA4[Dh%9&oX@kpdtr:e=GHZ6(o{Z0G{/5dT.T>===RGf5}Jox.2fpz(C]$y)C4LN+BeYH>a[@:Z]{X{yr*51=$Hc6pOSUH<Dx#",
      { standard: "Z85" },
    ),
  ),
);
