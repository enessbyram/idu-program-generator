import './showprogram.css'

export default function ShowProgram() {


    //program için bir tablo oluşturalım bu kısımda. hocanın mailine göre hocanın girdiği dersler random olarak programa yerleştirilsin.
    //ders saatleri de databaseden gelecek.

    return (
        <div className="showprogram-container">
            <table className='showprogram-table'>
                <thead>
                    <tr>
                        <td>Günler / Saatler</td>
                        <td>Pazartesi</td>
                        <td>Salı</td>
                        <td>Çarşamba</td>
                        <td>Perşembe</td>
                        <td>Cuma</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>08.30 - 09.15</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                    <tr>
                        <td>09.25 - 10.10</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                    <tr>
                        <td>10.20 - 11.05</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                    <tr>
                        <td>11.15 - 12.00</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                    <tr>
                        <td>12.30 - 13.15</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                    <tr>
                        <td>13.25 - 14.10</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                    <tr>
                        <td>14.20 - 15.05</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                    <tr>
                        <td>15.15 - 16.00</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                    <tr>
                        <td>16.10 - 16.55</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                    <tr>
                        <td>17.05 - 17.50</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                    <tr>
                        <td>18.00 - 18.45</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                        <td>Ders Kodu - Ders Adı - Ders Sınıfı</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}