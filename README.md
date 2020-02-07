# İBB İETT Geojson API!
Bu repo, [İstanbul Büyükşehir Belediyesi Açık veri Portalı](https://data.ibb.gov.tr)'ndan temin edilmiş İETT'ye ait SOAP servislerin **geojson** formatında  yayınlanmasını sağlayan açık kaynak kodlu bir yazılımı içermektedir. Kodları inceleyebilir ve projenin geliştirilmesine katkı sağlayabilirsiniz.
Aşağıdaki servisler ile ;
 1. API olarak güncel veriye erişebilirsiniz.
 2. Belirli zamanlarda request edeceğiniz geojson'ı kayıt ederek zamansal analizler 	gerçekleştirebilirsiniz. 
 3. KeplerGL, Carto, Tableau gibi veri görselleştirme yazılımları ile görselleştirme yapabilmek için ise servisten dönen veriyi ***.geojson** uzantılı olarak kaydedebilirsiniz.
# Geojson Servisler
1. İETT Otobüslerinin anlık konumları 
https://mekansal.herokuapp.com/api/filo
 2. İETT Otobüs Durakları anlık konumları 
https://mekansal.herokuapp.com/api/durak
3. İETT Otobüs Garajları
https://mekansal.herokuapp.com/api/garaj
ve 
4. İETT Duyurular (**json**)
https://mekansal.herokuapp.com/api/duyuru 

# Teknik Bilgiler
İBB Açık Veri Portalı' nda yayınlanan SOAP servisleri harita üretimi için uygun bir formatta yayınlanmamakta ve bir dizi işlem gerektirmektedir. 
Uygulamada, gerekli koordinat ve veri tipi dönüşümleri gerçekleştirilerek featurecollection olarak yayınlanmaktadır.
Hazırlanan bu küçük API ile görselleştirme çalışmaları ve harita ile uğraşmak isteyen üniversite öğrencileri ya da 
Webstorm kullanılarak geliştirilen proje ExpressJs kullanılarak oluşturulan bir Nodejs uygulamasıdır. Herokuya deploy edilerek https://mekansal.herokuapp.com adresi üzerinden yayınlanması sağlanmaktadır. Anasayfada verilerin görüntülenmesini sağlayan temel bir  harita vardır. 
**Notlar**
SOAP servisleri her gece saat 00.15'den sonra kapatılmaktadır.
SOAP servisleri yavaştır ve çok sayıda durak olduğu için normalden geç yüklenmektedir.

**Anahtar kelimeler**
 #nodejs #expressjs #geojson #webstorm #pug #mapboxGL #soap #proj4 #github
