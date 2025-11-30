import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import { PrevisaoAlocacaoService } from '../services/PrevisaoAlocacaoService';

export default class ExportPrevisaoController {
  static async exportar(req: Request, res: Response) {
    const { id } = req.params;
    const previsao = await new PrevisaoAlocacaoService().buscarPrevisaoPorId(Number(id));
    if (!previsao) return res.status(404).json({ error: 'Previsão não encontrada' });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Previsão');

    sheet.addRow(['Turma', 'Curso', 'Período', 'Alunos', 'Sala', 'Bloco', 'Tamanho']);

    previsao.dados.alocacao.forEach((item: { turma: any, sala: any }) => {
      const { turma, sala } = item;
      sheet.addRow([
        turma.periodoAtual,
        turma.curso.nome,
        turma.periodoAtual,
        turma.alunosPrevistos,
        sala ? sala.sala.numero : 'Não alocada',
        sala ? sala.sala.bloco : '',
        sala ? sala.tamanho : ''
      ]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=previsao_${id}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  }
}
