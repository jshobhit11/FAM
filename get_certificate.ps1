# Download SSL certificate from server
$url = "ipdsmobileapps.kdiscoms.org"
$port = 9200

Write-Host "Connecting to $url`:$port..." -ForegroundColor Yellow

try {
    # Create TCP connection
    $tcpClient = New-Object System.Net.Sockets.TcpClient($url, $port)
    $sslStream = New-Object System.Net.Security.SslStream($tcpClient.GetStream(), $false, {$true})

    # Perform SSL handshake
    $sslStream.AuthenticateAsClient($url)

    # Get certificate
    $cert = $sslStream.RemoteCertificate

    # Export to file
    $certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
    $outputPath = Join-Path $PWD "kdiscoms.cer"
    [System.IO.File]::WriteAllBytes($outputPath, $certBytes)

    # Display certificate info
    Write-Host "`n✅ Certificate downloaded successfully!" -ForegroundColor Green
    Write-Host "Saved to: $outputPath" -ForegroundColor Cyan
    Write-Host "`nCertificate Details:" -ForegroundColor Yellow
    Write-Host "Subject: $($cert.Subject)"
    Write-Host "Issuer: $($cert.Issuer)"
    Write-Host "Valid From: $($cert.GetEffectiveDateString())"
    Write-Host "Valid To: $($cert.GetExpirationDateString())"
    Write-Host "Thumbprint: $($cert.GetCertHashString())"
    
    Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Upload kdiscoms.cer to: https://report-uri.com/home/pubkey_hash"
    Write-Host "2. Copy the SHA-256 hash for your network_security_config.xml"

    # Cleanup
    $sslStream.Close()
    $tcpClient.Close()

} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "Make sure the server is accessible and the port is correct." -ForegroundColor Red
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
