import 'package:flutter/material.dart';

void main() {
  runApp(const CalculatorApp());
}

class CalculatorApp extends StatelessWidget {
  const CalculatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: CalculatorPage(),
    );
  }
}

class CalculatorPage extends StatefulWidget {
  const CalculatorPage({super.key});

  @override
  State<CalculatorPage> createState() => _CalculatorPageState();
}

class _CalculatorPageState extends State<CalculatorPage> {
  String _input = "";
  String _result = "0";

  void _onPressed(String value) {
    setState(() {
      if (value == "C") {
        _input = "";
        _result = "0";
      } else if (value == "=") {
        try {
          _result = _evaluate(_input);
        } catch (e) {
          _result = "Error";
        }
      } else {
        _input += value;
      }
    });
  }

  String _evaluate(String expression) {
    // Very basic evaluation: supports +, -, *, /
    try {
      expression = expression.replaceAll("×", "*").replaceAll("÷", "/");
      final result = double.parse(
        _calculate(expression).toStringAsFixed(6),
      );
      return result % 1 == 0 ? result.toInt().toString() : result.toString();
    } catch (_) {
      return "Error";
    }
  }

  double _calculate(String expr) {
    // WARNING: This is a simple parser, for demo only.
    // It splits by operators and applies left to right.
    List<String> tokens = expr.split(RegExp(r'([+\-*/])')).map((e) => e.trim()).toList();
    double result = double.parse(tokens[0]);
    for (int i = 1; i < tokens.length; i += 2) {
      String op = tokens[i];
      double num = double.parse(tokens[i + 1]);
      if (op == "+") result += num;
      if (op == "-") result -= num;
      if (op == "*") result *= num;
      if (op == "/") result /= num;
    }
    return result;
  }

  Widget _buildButton(String text, {Color color = Colors.blue}) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(6.0),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.all(20),
            backgroundColor: color,
          ),
          onPressed: () => _onPressed(text),
          child: Text(
            text,
            style: const TextStyle(fontSize: 24, color: Colors.white),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Calculator")),
      body: Column(
        children: [
          // Display Input & Result
          Expanded(
            child: Container(
              alignment: Alignment.bottomRight,
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(_input, style: const TextStyle(fontSize: 32, color: Colors.black54)),
                  const SizedBox(height: 10),
                  Text(_result, style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ),
          // Buttons
          Column(
            children: [
              Row(children: [_buildButton("7"), _buildButton("8"), _buildButton("9"), _buildButton("÷", color: Colors.orange)]),
              Row(children: [_buildButton("4"), _buildButton("5"), _buildButton("6"), _buildButton("×", color: Colors.orange)]),
              Row(children: [_buildButton("1"), _buildButton("2"), _buildButton("3"), _buildButton("-", color: Colors.orange)]),
              Row(children: [_buildButton("C", color: Colors.red), _buildButton("0"), _buildButton("=", color: Colors.green), _buildButton("+", color: Colors.orange)]),
            ],
          )
        ],
      ),
    );
  }
}
