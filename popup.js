// Abrir modal
document.querySelectorAll(".abrir-modal").forEach(botao => {
  botao.addEventListener("click", () => {
    const modalId = botao.getAttribute("data-modal");
    document.getElementById(modalId).style.display = "block";
  });
});

// Fechar modal
document.querySelectorAll(".fechar").forEach(span => {
  span.addEventListener("click", () => {
    span.closest(".modal").style.display = "none";
  });
});

// Copiar texto
document.querySelectorAll(".modal button[data-text]").forEach(botao => {
  botao.addEventListener("click", () => {
    const texto = botao.getAttribute("data-text");
    navigator.clipboard.writeText(texto).then(() => {
      const original = botao.textContent;
      botao.textContent = "✅ Copiado!";
      setTimeout(() => {
        botao.textContent = original;
      }, 1000);
    });
  });
});

// Fechar modal ao clicar fora
window.addEventListener("click", event => {
  document.querySelectorAll(".modal").forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});